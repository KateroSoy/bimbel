<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Resources;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);

        $key = 'login:'.Str::lower($data['email']).'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Terlalu banyak percobaan. Coba lagi dalam '.RateLimiter::availableIn($key).' detik.'], 429);
        }

        $user = User::where('email', $data['email'])->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages(['email' => 'Email atau password salah.']);
        }
        if ($user->status !== 'active') {
            throw ValidationException::withMessages(['email' => 'Akun ini dinonaktifkan. Hubungi admin.']);
        }
        RateLimiter::clear($key);

        return response()->json(['token' => $user->createToken('spa')->plainTextToken, 'user' => $user->toApi()]);
    }

    /** Self-registration creates a student account and its student record. */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:191', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = new User(['name' => $data['name'], 'email' => $data['email'], 'phone' => $data['phone'] ?? null, 'password' => $data['password']]);
            $user->role = 'siswa';
            $user->save();

            $student = Resources::model('students');
            $student->ref = Resources::nextRef('students');
            $student->forceFill(['name' => $user->name, 'email' => $user->email, 'phone' => $user->phone, 'status' => 'Aktif', 'user_id' => $user->id])->save();

            return $user;
        });

        return response()->json(['token' => $user->createToken('spa')->plainTextToken, 'user' => $user->toApi()], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['ok' => true]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()->toApi()]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'email' => ['sometimes', 'required', 'email', 'max:191', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'profile' => ['sometimes', 'array'],
        ]);
        if (isset($data['profile'])) {
            $data['profile'] = array_merge($user->profile ?? [], $data['profile']);
        }
        $user->update($data);
        // A student's contact details also live on the student record the admin sees.
        if ($student = $user->student()) {
            $student->forceFill(array_intersect_key($data, array_flip(['name', 'email', 'phone'])))->save();
        }

        return response()->json(['user' => $user->toApi()]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'currentPassword' => ['required', 'string'],
            'password' => ['required', PasswordRule::min(8)],
        ]);
        $user = $request->user();
        if (! Hash::check($data['currentPassword'], $user->password)) {
            throw ValidationException::withMessages(['currentPassword' => 'Password saat ini tidak sesuai.']);
        }
        $user->update(['password' => $data['password']]);
        // Sign out every other device
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return response()->json(['ok' => true]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);
        Password::sendResetLink($request->only('email'));

        // Same answer whether or not the address exists, so accounts cannot be enumerated.
        return response()->json(['message' => 'Jika email terdaftar, tautan reset password telah dikirim.']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset($data, function (User $user, string $password) {
            $user->forceFill(['password' => $password, 'remember_token' => Str::random(60)])->save();
            $user->tokens()->delete();
            event(new PasswordReset($user));
        });
        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => 'Tautan reset tidak valid atau sudah kedaluwarsa.']);
        }

        return response()->json(['message' => 'Password berhasil diperbarui.']);
    }
}
