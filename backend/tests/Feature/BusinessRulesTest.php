<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BusinessRulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_schedule_clash_on_tutor_or_room_is_rejected(): void
    {
        $this->actingAsRole('admin');
        $base = ['kelas' => 'English 1A', 'day' => 1, 'slot' => 2, 'tutor' => 'Fitri', 'room' => 'Ruang 1'];
        $first = $this->postJson('/api/r/schedules', $base)->assertCreated()->json('data.id');

        $this->postJson('/api/r/schedules', ['kelas' => 'Math', 'room' => 'Ruang 2'] + $base)->assertStatus(422)->assertJsonValidationErrors('slot');
        $this->postJson('/api/r/schedules', ['kelas' => 'Math', 'tutor' => 'Andi'] + $base)->assertStatus(422);
        $this->assertDatabaseCount('schedules', 1);

        $other = $this->postJson('/api/r/schedules', ['kelas' => 'Math', 'tutor' => 'Andi', 'room' => 'Ruang 2'] + $base)->assertCreated()->json('data.id');
        $this->postJson('/api/r/schedules', ['slot' => 3] + $base)->assertCreated();

        // moving an entry onto an occupied slot is also rejected; saving it unchanged is fine
        $this->putJson("/api/r/schedules/$other", ['room' => 'Ruang 1'])->assertStatus(422);
        $this->putJson("/api/r/schedules/$first", ['fill' => '9/10'])->assertOk();
        $this->postJson('/api/r/schedules', ['day' => 9] + $base)->assertStatus(422)->assertJsonValidationErrors('day');
    }

    public function test_bill_status_is_derived_from_amounts(): void
    {
        $this->actingAsRole('admin');

        $id = $this->postJson('/api/r/bills', ['name' => 'Andi', 'amount' => 500000, 'discount' => 50000, 'status' => 'Lunas'])->assertCreated()->assertJsonPath('data.status', 'Terlambat')->json('data.id');
        $this->putJson("/api/r/bills/$id", ['paid' => 200000])->assertOk()->assertJsonPath('data.status', 'Belum Lunas');
        $this->putJson("/api/r/bills/$id", ['paid' => 900000])->assertOk()->assertJsonPath('data.status', 'Lunas')->assertJsonPath('data.paid', 450000);

        $this->assertDatabaseHas('bills', ['ref' => $id, 'paid' => 450000, 'status' => 'Lunas', 'verification' => 'none']);
    }

    public function test_student_pay_sets_pending_and_admin_confirms(): void
    {
        [$user, $student] = $this->makeStudent();
        [, $other] = $this->makeStudent('Lain');
        $bill = $this->makeRow('bills', ['name' => $student->name, 'amount' => 300000, 'status' => 'Terlambat', 'verification' => 'none', 'student_ref' => $student->ref]);
        $foreign = $this->makeRow('bills', ['name' => 'Lain', 'amount' => 300000, 'status' => 'Terlambat', 'student_ref' => $other->ref]);

        Sanctum::actingAs($user);
        $this->postJson("/api/student/bills/{$bill->ref}/pay", [])->assertStatus(422);
        $this->postJson("/api/student/bills/{$foreign->ref}/pay", ['method' => 'QRIS'])->assertNotFound();
        $this->postJson("/api/student/bills/{$bill->ref}/pay", ['method' => 'QRIS'])->assertOk()->assertJsonPath('bill.status', 'Menunggu Verifikasi');
        $this->assertDatabaseHas('bills', ['id' => $bill->id, 'verification' => 'pending', 'method' => 'QRIS', 'paid' => 0]);
        $this->putJson("/api/r/bills/{$bill->ref}", ['paid' => 300000])->assertForbidden();

        $this->actingAsRole('admin');
        $this->putJson("/api/r/bills/{$bill->ref}", ['paid' => 300000])->assertOk()->assertJsonPath('data.status', 'Lunas');
        $this->assertDatabaseHas('bills', ['id' => $bill->id, 'verification' => 'none', 'status' => 'Lunas']);

        Sanctum::actingAs($user);
        $this->postJson("/api/student/bills/{$bill->ref}/pay", ['method' => 'QRIS'])->assertStatus(422);
    }

    public function test_settings_are_admin_writable_and_persist(): void
    {
        $this->actingAsRole('guru');
        $this->getJson('/api/settings')->assertOk()->assertJsonPath('data.schoolName', '');
        $this->putJson('/api/settings', ['schoolName' => 'X'])->assertForbidden();

        $this->actingAsRole('admin');
        $this->putJson('/api/settings', ['schoolName' => 'StudyHack', 'email' => 'bukan-email'])->assertStatus(422);
        $this->putJson('/api/settings', ['schoolName' => 'StudyHack', 'email' => 'halo@studyhack.id'])->assertOk()->assertJsonPath('data.schoolName', 'StudyHack');
        $this->assertDatabaseHas('settings', ['key' => 'schoolName', 'value' => 'StudyHack']);
    }

    public function test_admin_dashboard_counts_match_the_tables(): void
    {
        $this->actingAsRole('admin');
        $this->makeRow('students', ['name' => 'A', 'status' => 'Aktif', 'program' => 'Combo']);
        $this->makeRow('students', ['name' => 'B', 'status' => 'Nonaktif', 'program' => 'Combo']);
        $this->makeRow('payments', ['name' => 'A', 'paid' => 400000, 'status' => 'Berhasil']);
        $this->makeRow('payments', ['name' => 'B', 'paid' => 999, 'status' => 'Gagal']);
        $this->makeRow('expenses', ['category' => 'ATK', 'amount' => 150000]);
        $this->makeRow('bills', ['name' => 'A', 'amount' => 500000, 'discount' => 100000, 'paid' => 100000, 'status' => 'Belum Lunas', 'verification' => 'pending']);

        $this->getJson('/api/admin/dashboard')->assertOk()
            ->assertJsonPath('students.total', 2)->assertJsonPath('students.active', 1)->assertJsonPath('students.byProgram.Combo', 2)
            ->assertJsonPath('finance.income', 400000)->assertJsonPath('finance.expense', 150000)
            ->assertJsonPath('finance.outstanding', 300000)->assertJsonPath('finance.unpaidStudents', 1)->assertJsonPath('finance.pendingVerification', 1);
    }
}
