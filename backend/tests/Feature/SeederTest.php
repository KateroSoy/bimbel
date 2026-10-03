<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\Resources;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_fresh_seed_creates_accounts_and_demo_content(): void
    {
        $this->seed();

        $this->assertSame(['admin', 'guru', 'siswa'], User::orderBy('id')->pluck('role')->all());
        // resources filled by the seeder directly rather than from an exported list
        $special = ['student-subjects', 'student-attendances'];
        foreach (Resources::names() as $name) {
            if (isset(Resources::def($name)['seed']) || in_array($name, $special, true)) {
                $this->assertGreaterThan(0, DB::table(Resources::table($name))->count(), "$name is empty after seeding");
            }
        }
        $this->assertDatabaseHas('students', ['ref' => DatabaseSeeder::STUDENT_REF, 'user_id' => User::where('role', 'siswa')->value('id')]);
        $this->assertSame(5, DB::table('course_enrollments')->count());
        $this->assertGreaterThan(0, DB::table('lesson_progress')->count());
        $this->assertSame(7, DB::table('settings')->count());
        $this->assertSame(0, DB::table('assignments')->whereNull('mode')->count());

        // running it again must not duplicate anything
        $this->seed();
        $this->assertSame(3, User::count());
    }

    public function test_seeded_accounts_can_log_in_and_see_their_data(): void
    {
        $this->seed();

        $this->postJson('/api/auth/login', ['email' => 'admin@studyhack.id', 'password' => 'LearnSpace#2026'])->assertOk()->assertJsonPath('user.role', 'admin');

        Sanctum::actingAs(User::where('role', 'siswa')->first());
        $portal = $this->getJson('/api/student/portal')->assertOk()->json();
        $this->assertSame('Andi Pratama', $portal['student']['name']);
        $this->assertCount(5, $portal['subjects']);
        $this->assertCount(5, $portal['courses']);
        $this->assertCount(6, $portal['bills']);
        $this->assertNotEmpty($portal['liveClasses']);
        $this->getJson('/api/r/submissions')->assertOk()->assertJsonCount(DB::table('submissions')->where('student_id', DatabaseSeeder::STUDENT_REF)->count(), 'data');

        Sanctum::actingAs(User::where('role', 'guru')->first());
        $this->getJson('/api/r/tutor-classes')->assertOk()->assertJsonCount(6, 'data');
        $this->getJson('/api/r/conversations')->assertOk()->assertJsonPath('data.0.messages.0.from', 'them');
    }
}
