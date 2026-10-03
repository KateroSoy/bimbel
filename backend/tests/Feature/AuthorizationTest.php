<?php

namespace Tests\Feature;

use App\Support\Resources;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public static function protectedRoutes(): array
    {
        return [
            ['get', '/api/me'], ['put', '/api/me'], ['get', '/api/settings'], ['get', '/api/admin/dashboard'], ['get', '/api/student/portal'],
            ['get', '/api/r/students'], ['post', '/api/r/students'], ['put', '/api/r/students/1'], ['delete', '/api/r/students/1'],
            ['post', '/api/student/lessons/x/complete'], ['get', '/api/courses/x/modules'],
        ];
    }

    #[DataProvider('protectedRoutes')]
    public function test_guest_is_rejected(string $method, string $uri): void
    {
        $this->json($method, $uri)->assertUnauthorized();
    }

    /** Every resource × every role: allowed exactly when the registry says so. */
    public function test_resource_access_follows_the_registry(): void
    {
        foreach (['admin', 'guru', 'siswa'] as $role) {
            $this->actingAsRole($role);
            foreach (Resources::names() as $name) {
                $def = Resources::def($name);
                $read = $this->getJson("/api/r/$name")->status();
                $this->assertSame(in_array($role, $def['read'], true) ? 200 : 403, $read, "$role read $name");

                if (! in_array($role, $def['write'], true)) {
                    $this->postJson("/api/r/$name", ['name' => 'x', 'title' => 'x'])->assertForbidden();
                    $this->putJson("/api/r/$name/1", ['name' => 'x'])->assertForbidden();
                    $this->deleteJson("/api/r/$name/1")->assertForbidden();
                }
            }
        }
    }

    public function test_unknown_resource_is_404(): void
    {
        $this->actingAsRole('admin');

        $this->getJson('/api/r/users')->assertNotFound();
        $this->getJson('/api/r/password_reset_tokens')->assertNotFound();
    }

    public function test_role_only_endpoints(): void
    {
        $this->actingAsRole('siswa');
        $this->getJson('/api/admin/dashboard')->assertForbidden();
        $this->putJson('/api/settings', ['schoolName' => 'X'])->assertForbidden();
        $this->getJson('/api/courses/x/modules')->assertForbidden();

        $this->actingAsRole('guru');
        $this->getJson('/api/admin/dashboard')->assertForbidden();
        $this->getJson('/api/student/portal')->assertForbidden();
        $this->postJson('/api/courses/x/enrollments', ['studentId' => 'x'])->assertForbidden();

        $this->actingAsRole('admin');
        $this->getJson('/api/admin/dashboard')->assertOk();
        $this->getJson('/api/student/portal')->assertForbidden();
    }

    public function test_student_only_sees_own_rows(): void
    {
        [$userA, $studentA] = $this->makeStudent('Siswa A');
        [, $studentB] = $this->makeStudent('Siswa B');
        foreach ([$studentA, $studentB] as $student) {
            $this->makeRow('bills', ['name' => $student->name, 'amount' => 100, 'student_ref' => $student->ref]);
            $this->makeRow('student-attendances', ['status' => 'Hadir', 'student_ref' => $student->ref]);
            $this->makeRow('submissions', ['assignment_id' => 'T1', 'student_id' => $student->ref, 'student_name' => $student->name]);
        }

        Sanctum::actingAs($userA);
        $this->getJson('/api/r/bills')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Siswa A');
        $this->getJson('/api/r/student-attendances')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/r/submissions')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.studentName', 'Siswa A');
    }

    public function test_tutor_only_sees_and_edits_own_rows(): void
    {
        $tutorA = $this->makeUser('guru');
        $tutorB = $this->makeUser('guru');
        $mine = $this->makeRow('conversations', ['name' => 'Chat A', 'owner_id' => $tutorA->id]);
        $theirs = $this->makeRow('conversations', ['name' => 'Chat B', 'owner_id' => $tutorB->id]);

        Sanctum::actingAs($tutorA);
        $this->getJson('/api/r/conversations')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $mine->ref);
        $this->putJson("/api/r/conversations/{$theirs->ref}", ['preview' => 'intip'])->assertNotFound();
        $this->deleteJson("/api/r/conversations/{$theirs->ref}")->assertNotFound();
        $this->assertDatabaseHas('conversations', ['id' => $theirs->id, 'preview' => null]);

        $created = $this->postJson('/api/r/conversations', ['name' => 'Baru', 'ownerId' => $tutorB->id])->assertCreated()->json('data.id');
        $this->assertDatabaseHas('conversations', ['ref' => $created, 'owner_id' => $tutorA->id]);

        $this->actingAsRole('admin');
        $this->getJson('/api/r/conversations')->assertOk()->assertJsonCount(3, 'data');
    }
}
