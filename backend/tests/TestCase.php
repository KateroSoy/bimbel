<?php

namespace Tests;

use App\Models\Record;
use App\Models\User;
use App\Support\Resources;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    protected function makeUser(string $role, array $attributes = []): User
    {
        $user = new User($attributes + ['name' => ucfirst($role).' Test', 'email' => Str::random(8).'@example.test', 'password' => 'secret-password']);
        $user->role = $role;
        $user->save();

        return $user;
    }

    /** A siswa account with its linked student row. */
    protected function makeStudent(string $name = 'Siswa Uji'): array
    {
        $user = $this->makeUser('siswa', ['name' => $name]);
        $student = $this->makeRow('students', ['name' => $name, 'status' => 'Aktif', 'user_id' => $user->id]);

        return [$user, $student];
    }

    protected function makeRow(string $resource, array $columns): Record
    {
        $row = Resources::model($resource);
        $row->ref = Resources::nextRef($resource);
        $row->forceFill($columns)->save();

        return $row;
    }

    protected function actingAsRole(string $role): User
    {
        $user = $role === 'siswa' ? $this->makeStudent()[0] : $this->makeUser($role);
        Sanctum::actingAs($user);

        return $user;
    }
}
