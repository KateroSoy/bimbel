<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/** Revisi tahap 2: website sign-up, basic-skills test, alumni, payment settings, class mode. */
class RevisionTahap2Test extends TestCase
{
    use RefreshDatabase;

    private function registration(array $overrides = []): array
    {
        return $overrides + [
            'name' => 'Raka Putra', 'age' => 8, 'gender' => 'L', 'program' => 'Math Essential', 'parentName' => 'Ibu Sari',
            'phone' => '0812-1111-2222', 'email' => 'sari@example.com', 'school' => 'SD Negeri 1', 'level' => 'Kids', 'method' => 'Online',
            'note' => 'Promo Bawa Teman: Dina',
        ];
    }

    public function test_website_registration_reaches_admin_without_login(): void
    {
        $id = $this->postJson('/api/public/registrations', $this->registration())->assertCreated()->json('data.id');

        $this->assertDatabaseHas('registrations', [
            'ref' => $id, 'name' => 'Raka Putra', 'program' => 'Math Essential', 'source' => 'Website', 'status' => 'Menunggu Verifikasi',
            'parent_name' => 'Ibu Sari', 'phone' => '0812-1111-2222', 'method' => 'Online',
        ]);
        $this->assertDatabaseHas('admin_notifications', ['title' => 'Pendaftar baru: Raka Putra', 'to' => '/admin/pendaftaran', 'unread' => true]);

        $this->actingAsRole('admin');
        $this->getJson('/api/r/registrations')->assertOk()->assertJsonPath('data.0.parentName', 'Ibu Sari');
    }

    public function test_website_registration_is_validated(): void
    {
        $this->postJson('/api/public/registrations', $this->registration(['name' => '', 'phone' => 'abc']))
            ->assertStatus(422)->assertJsonValidationErrors(['name', 'phone']);
        $this->postJson('/api/public/registrations', $this->registration(['method' => 'Privat']))->assertStatus(422);
        // Honeypot field filled by a bot
        $this->postJson('/api/public/registrations', $this->registration(['website' => 'spam']))->assertStatus(422);
        $this->assertDatabaseCount('registrations', 0);
    }

    public function test_public_info_exposes_only_the_app_link(): void
    {
        DB::table('settings')->insert([
            ['key' => 'appDownloadUrl', 'value' => 'https://drive.google.com/drive/folders/abc'],
            ['key' => 'bankAccounts', 'value' => 'BCA | 123 | StudyHack'],
        ]);

        $this->getJson('/api/public/info')->assertOk()
            ->assertExactJson(['data' => ['appDownloadUrl' => 'https://drive.google.com/drive/folders/abc']]);
    }

    public function test_payment_accounts_are_saved_by_admin_and_read_by_students(): void
    {
        $this->actingAsRole('admin');
        $this->putJson('/api/settings', ['bankAccounts' => "BCA | 1234567890 | StudyHack\nMandiri | 987 | StudyHack", 'ewallets' => 'DANA | 0812 | StudyHack'])
            ->assertOk()->assertJsonPath('data.ewallets', 'DANA | 0812 | StudyHack');
        $this->putJson('/api/settings', ['appDownloadUrl' => 'not-a-url'])->assertStatus(422);

        $this->actingAsRole('siswa');
        $this->getJson('/api/settings')->assertOk()->assertJsonPath('data.bankAccounts', "BCA | 1234567890 | StudyHack\nMandiri | 987 | StudyHack");
        $this->putJson('/api/settings', ['bankAccounts' => 'x'])->assertForbidden();
    }

    public function test_placement_tests_and_alumni_are_admin_resources(): void
    {
        $this->actingAsRole('admin');
        $this->postJson('/api/r/placement-tests', [
            'name' => 'Calon A', 'grade' => 'Kelas 3', 'subject' => 'Matematika', 'correct' => 12, 'total' => 15, 'score' => 80,
            'level' => 'Menengah', 'answers' => ['m1' => 2],
        ])->assertCreated()->assertJsonPath('data.id', 'TKD-0001')->assertJsonPath('data.answers.m1', 2);
        $this->postJson('/api/r/alumni', ['name' => 'Alumni A', 'year' => '2025', 'continuedTo' => 'SMP Negeri 1'])
            ->assertCreated()->assertJsonPath('data.continuedTo', 'SMP Negeri 1');

        $this->actingAsRole('guru');
        $this->getJson('/api/r/placement-tests')->assertForbidden();
        $this->getJson('/api/r/alumni')->assertForbidden();
    }

    public function test_tutor_messages_only_own_students_admin_and_tutors(): void
    {
        $other = $this->makeUser('guru', ['name' => 'Ms. Fitri']);
        $me = $this->actingAsRole('guru');
        $this->makeRow('class-students', ['name' => 'Murid Saya', 'kelas' => 'Batch A', 'owner_id' => $me->id]);
        $this->makeRow('class-students', ['name' => 'Murid Lain', 'kelas' => 'Batch B', 'owner_id' => $other->id]);

        $names = collect($this->getJson('/api/guru/contacts')->assertOk()->json('data'))->pluck('name');
        $this->assertTrue($names->contains('Murid Saya'));
        $this->assertTrue($names->contains('Ms. Fitri'));
        $this->assertTrue($names->contains('Tim Admin StudyHack'));
        $this->assertFalse($names->contains('Murid Lain'));

        $this->postJson('/api/r/conversations', ['name' => 'Wali X', 'role' => 'Orang Tua Siswa'])->assertStatus(422);
        $this->postJson('/api/r/conversations', ['name' => 'Murid Saya', 'role' => 'Siswa'])->assertCreated();
    }

    public function test_tutor_sets_class_mode_and_meet_link(): void
    {
        $this->actingAsRole('guru');
        $id = $this->postJson('/api/r/tutor-classes', ['name' => 'Batch Online', 'status' => 'Aktif'])->assertCreated()->json('data.id');

        $this->putJson("/api/r/tutor-classes/$id", ['mode' => 'Online', 'meetUrl' => 'https://meet.google.com/abc-defg-hij'])
            ->assertOk()->assertJsonPath('data.mode', 'Online')->assertJsonPath('data.meetUrl', 'https://meet.google.com/abc-defg-hij');
    }
}
