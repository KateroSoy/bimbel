<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_reports_use_current_database_rows(): void
    {
        $this->actingAsRole('admin');
        $this->makeRow('students', ['name' => 'A', 'program' => 'Math', 'status' => 'Aktif', 'gpa' => 90]);
        $this->makeRow('students', ['name' => 'B', 'program' => 'Math', 'status' => 'Nonaktif', 'gpa' => 70]);
        $this->makeRow('rombels', ['name' => 'Kelas 1', 'students' => 2, 'capacity' => 10, 'status' => 'Aktif']);
        $this->makeRow('staff', ['name' => 'Tutor A', 'role' => 'Tutor', 'status' => 'Aktif']);

        $this->getJson('/api/admin/reports/students')->assertOk()
            ->assertJsonPath('metrics.0.value', 2)
            ->assertJsonPath('rows.0.program', 'Math')
            ->assertJsonPath('rows.0.total', 2)
            ->assertJsonPath('rows.0.active', 1);
        $this->getJson('/api/admin/reports/classes')->assertOk()->assertJsonPath('rows.0.name', 'Kelas 1');
        $this->getJson('/api/admin/reports/tutors')->assertOk()->assertJsonPath('rows.0.name', 'Tutor A');
        $this->getJson('/api/admin/reports/operations')->assertOk()->assertJsonPath('title', 'Laporan Operasional');
        $this->getJson('/api/admin/reports/overview')->assertOk()->assertJsonPath('metrics.0.value', 2);
        $this->getJson('/api/admin/reports/unknown')->assertNotFound();
    }

    public function test_reports_are_admin_only(): void
    {
        $this->getJson('/api/admin/reports/overview')->assertUnauthorized();
        Sanctum::actingAs($this->makeUser('guru'));
        $this->getJson('/api/admin/reports/overview')->assertForbidden();
    }
}
