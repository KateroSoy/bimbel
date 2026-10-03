<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Institution settings (one key/value row each). */
class SettingsController extends Controller
{
    private const KEYS = ['schoolName', 'address', 'academicYear', 'phone', 'email', 'principalName', 'website'];

    public function show(): JsonResponse
    {
        $stored = DB::table('settings')->pluck('value', 'key');

        return response()->json(['data' => collect(self::KEYS)->mapWithKeys(fn ($k) => [$k => $stored[$k] ?? ''])]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'schoolName' => ['sometimes', 'required', 'string', 'max:191'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'academicYear' => ['sometimes', 'nullable', 'string', 'max:191'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:60'],
            'email' => ['sometimes', 'nullable', 'email', 'max:191'],
            'principalName' => ['sometimes', 'nullable', 'string', 'max:191'],
            'website' => ['sometimes', 'nullable', 'string', 'max:191'],
        ]);
        foreach ($data as $key => $value) {
            DB::table('settings')->updateOrInsert(['key' => $key], ['value' => $value, 'updated_at' => now()]);
        }

        return $this->show();
    }
}
