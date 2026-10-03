<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_user_can_login_and_use_the_token(): void
    {
        $user = $this->makeUser('admin', ['email' => 'admin@example.test']);

        $response = $this->postJson('/api/auth/login', ['email' => 'admin@example.test', 'password' => 'secret-password'])
            ->assertOk()->assertJsonPath('user.role', 'admin')->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']]);

        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->withToken($response->json('token'))->getJson('/api/me')->assertOk()->assertJsonPath('user.email', $user->email);
    }

    public function test_wrong_password_is_rejected(): void
    {
        $this->makeUser('admin', ['email' => 'admin@example.test']);

        $this->postJson('/api/auth/login', ['email' => 'admin@example.test', 'password' => 'nope'])->assertStatus(422)->assertJsonValidationErrors('email');
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_inactive_user_is_rejected(): void
    {
        $user = $this->makeUser('guru', ['email' => 'off@example.test']);
        $user->forceFill(['status' => 'inactive'])->save();

        $this->postJson('/api/auth/login', ['email' => 'off@example.test', 'password' => 'secret-password'])->assertStatus(422);
    }

    public function test_login_is_throttled_after_five_failures(): void
    {
        $this->makeUser('admin', ['email' => 'admin@example.test']);
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', ['email' => 'admin@example.test', 'password' => 'nope'])->assertStatus(422);
        }

        $this->postJson('/api/auth/login', ['email' => 'admin@example.test', 'password' => 'secret-password'])->assertStatus(429);
    }

    public function test_logout_revokes_the_token(): void
    {
        $this->makeUser('admin', ['email' => 'admin@example.test']);
        $token = $this->postJson('/api/auth/login', ['email' => 'admin@example.test', 'password' => 'secret-password'])->json('token');

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_register_creates_a_student_account_and_record(): void
    {
        $payload = ['name' => 'Rina Baru', 'email' => 'rina@example.test', 'phone' => '0812', 'password' => 'password-123', 'password_confirmation' => 'password-123'];

        $this->postJson('/api/auth/register', $payload)->assertCreated()->assertJsonPath('user.role', 'siswa')->assertJsonStructure(['token', 'user' => ['studentId']]);

        $user = User::where('email', 'rina@example.test')->firstOrFail();
        $this->assertSame('siswa', $user->role);
        $this->assertNotSame('password-123', $user->password);
        $this->assertDatabaseHas('students', ['user_id' => $user->id, 'name' => 'Rina Baru', 'status' => 'Aktif']);

        $this->postJson('/api/auth/register', $payload)->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_register_cannot_choose_a_role(): void
    {
        $this->postJson('/api/auth/register', ['name' => 'X', 'email' => 'x@example.test', 'role' => 'admin', 'password' => 'password-123', 'password_confirmation' => 'password-123'])->assertCreated();

        $this->assertDatabaseHas('users', ['email' => 'x@example.test', 'role' => 'siswa']);
    }

    public function test_forgot_and_reset_password(): void
    {
        Notification::fake();
        $user = $this->makeUser('guru', ['email' => 'guru@example.test']);

        $this->postJson('/api/auth/forgot-password', ['email' => 'guru@example.test'])->assertOk();
        $this->postJson('/api/auth/forgot-password', ['email' => 'nobody@example.test'])->assertOk();

        $token = null;
        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use (&$token, $user) {
            $token = $notification->token;

            return str_contains($notification->toMail($user)->actionUrl, '/login?reset=');
        });

        $this->postJson('/api/auth/reset-password', ['email' => 'guru@example.test', 'token' => 'wrong', 'password' => 'new-password-1', 'password_confirmation' => 'new-password-1'])->assertStatus(422);
        $this->postJson('/api/auth/reset-password', ['email' => 'guru@example.test', 'token' => $token, 'password' => 'new-password-1', 'password_confirmation' => 'new-password-1'])->assertOk();

        $this->assertTrue(Hash::check('new-password-1', $user->fresh()->password));
        $this->postJson('/api/auth/login', ['email' => 'guru@example.test', 'password' => 'secret-password'])->assertStatus(422);
        $this->postJson('/api/auth/login', ['email' => 'guru@example.test', 'password' => 'new-password-1'])->assertOk();
    }

    public function test_change_password_requires_the_current_password(): void
    {
        $user = $this->makeUser('siswa');
        $token = $user->createToken('spa')->plainTextToken;

        $this->withToken($token)->putJson('/api/me/password', ['currentPassword' => 'wrong', 'password' => 'brand-new-pass'])->assertStatus(422);
        $this->assertTrue(Hash::check('secret-password', $user->fresh()->password));

        $this->withToken($token)->putJson('/api/me/password', ['currentPassword' => 'secret-password', 'password' => 'short'])->assertStatus(422);
        $this->withToken($token)->putJson('/api/me/password', ['currentPassword' => 'secret-password', 'password' => 'brand-new-pass'])->assertOk();
        $this->assertTrue(Hash::check('brand-new-pass', $user->fresh()->password));
    }

    public function test_profile_update_persists_and_checks_email_uniqueness(): void
    {
        $this->makeUser('admin', ['email' => 'taken@example.test']);
        $user = $this->actingAsRole('guru');

        $this->putJson('/api/me', ['name' => 'Nama Baru', 'phone' => '0899', 'profile' => ['education' => 'S2']])->assertOk()->assertJsonPath('user.profile.education', 'S2');
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Nama Baru', 'phone' => '0899']);

        $this->putJson('/api/me', ['email' => 'taken@example.test'])->assertStatus(422);
        $this->putJson('/api/me', ['role' => 'admin'])->assertOk();
        $this->assertSame('guru', $user->fresh()->role);
    }

    public function test_student_profile_update_also_updates_the_student_record(): void
    {
        $user = $this->actingAsRole('siswa');

        $this->putJson('/api/me', ['email' => 'baru@example.test', 'phone' => '0811-2222'])->assertOk();

        $this->assertDatabaseHas('students', ['user_id' => $user->id, 'email' => 'baru@example.test', 'phone' => '0811-2222']);
    }
}
