<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/** Aggregates for the admin dashboard, computed from the tables on every request. */
class DashboardController extends Controller
{
    /** Real aggregates for the admin report screens. Never return placeholder metrics. */
    public function report(string $section): JsonResponse
    {
        abort_unless(in_array($section, ['overview', 'students', 'classes', 'tutors', 'operations'], true), 404);

        $data = match ($section) {
            'overview' => [
                'title' => 'Laporan & Analitik',
                'metrics' => [
                    ['label' => 'Siswa', 'value' => DB::table('students')->count()],
                    ['label' => 'Kelas', 'value' => DB::table('rombels')->count()],
                    ['label' => 'Tutor aktif', 'value' => DB::table('staff')->where('role', 'Tutor')->where('status', 'Aktif')->count()],
                    ['label' => 'Tugas', 'value' => DB::table('assignments')->count()],
                ],
                'columns' => ['area' => 'Area', 'total' => 'Jumlah data'],
                'rows' => [
                    ['area' => 'Siswa', 'total' => DB::table('students')->count()],
                    ['area' => 'Kelas', 'total' => DB::table('rombels')->count()],
                    ['area' => 'Tutor', 'total' => DB::table('staff')->where('role', 'Tutor')->count()],
                    ['area' => 'Pendaftaran', 'total' => DB::table('registrations')->count()],
                    ['area' => 'Tugas', 'total' => DB::table('assignments')->count()],
                    ['area' => 'Pengumpulan', 'total' => DB::table('submissions')->count()],
                ],
            ],
            'students' => [
                'title' => 'Laporan Siswa',
                'metrics' => [
                    ['label' => 'Total siswa', 'value' => DB::table('students')->count()],
                    ['label' => 'Siswa aktif', 'value' => DB::table('students')->where('status', 'Aktif')->count()],
                    ['label' => 'Lulus', 'value' => DB::table('students')->where('status', 'Lulus')->count()],
                    ['label' => 'Pengumpulan tugas', 'value' => DB::table('submissions')->count()],
                ],
                'columns' => ['program' => 'Program', 'total' => 'Total', 'active' => 'Aktif', 'averageScore' => 'Rata-rata nilai'],
                'rows' => DB::table('students')->selectRaw("COALESCE(program, 'Belum ditentukan') as program, COUNT(*) as total, SUM(CASE WHEN status = 'Aktif' THEN 1 ELSE 0 END) as active, ROUND(AVG(gpa), 2) as averageScore")
                    ->groupBy('program')->orderByDesc('total')->get()->map(fn ($row) => [
                        'program' => $row->program,
                        'total' => (int) $row->total,
                        'active' => (int) $row->active,
                        'averageScore' => $row->averageScore === null ? null : (float) $row->averageScore,
                    ])->all(),
            ],
            'classes' => [
                'title' => 'Laporan Kelas',
                'metrics' => [
                    ['label' => 'Total kelas', 'value' => DB::table('rombels')->count()],
                    ['label' => 'Kelas aktif', 'value' => DB::table('rombels')->where('status', 'Aktif')->count()],
                    ['label' => 'Jadwal', 'value' => DB::table('schedules')->count()],
                    ['label' => 'Kapasitas kursi', 'value' => DB::table('rombels')->sum('capacity')],
                ],
                'columns' => ['name' => 'Kelas', 'level' => 'Level', 'tutor' => 'Tutor', 'students' => 'Siswa', 'capacity' => 'Kapasitas', 'status' => 'Status'],
                'rows' => DB::table('rombels')->select('name', 'level', 'tutor', 'students', 'capacity', 'status')->orderBy('name')->get()->all(),
            ],
            'tutors' => [
                'title' => 'Laporan Tutor',
                'metrics' => [
                    ['label' => 'Total tutor', 'value' => DB::table('staff')->where('role', 'Tutor')->count()],
                    ['label' => 'Tutor aktif', 'value' => DB::table('staff')->where('role', 'Tutor')->where('status', 'Aktif')->count()],
                    ['label' => 'Sesi mengajar', 'value' => DB::table('teach_sessions')->count()],
                    ['label' => 'Catatan mengajar', 'value' => DB::table('teaching_notes')->count()],
                ],
                'columns' => ['name' => 'Tutor', 'program' => 'Program', 'email' => 'Email', 'phone' => 'Telepon', 'status' => 'Status'],
                'rows' => DB::table('staff')->where('role', 'Tutor')->select('name', 'program', 'email', 'phone', 'status')->orderBy('name')->get()->all(),
            ],
            'operations' => [
                'title' => 'Laporan Operasional',
                'metrics' => [
                    ['label' => 'Pendaftaran', 'value' => DB::table('registrations')->count()],
                    ['label' => 'Inventaris', 'value' => DB::table('inventory_items')->count()],
                    ['label' => 'Kehadiran siswa', 'value' => DB::table('student_attendances')->count()],
                    ['label' => 'Pesan tercatat', 'value' => DB::table('whatsapp_logs')->count()],
                ],
                'columns' => ['area' => 'Area', 'total' => 'Jumlah data'],
                'rows' => [
                    ['area' => 'Pendaftaran', 'total' => DB::table('registrations')->count()],
                    ['area' => 'Barang inventaris', 'total' => DB::table('inventory_items')->count()],
                    ['area' => 'Stok barang', 'total' => DB::table('inventory_items')->sum('quantity')],
                    ['area' => 'Kehadiran siswa', 'total' => DB::table('student_attendances')->count()],
                    ['area' => 'Kehadiran tutor', 'total' => DB::table('tutor_attendances')->count()],
                    ['area' => 'Pesan WhatsApp tercatat', 'total' => DB::table('whatsapp_logs')->count()],
                ],
            ],
        };

        return response()->json($data + ['generatedAt' => now()->toIso8601String()]);
    }

    public function admin(): JsonResponse
    {
        $unpaid = DB::table('bills')->where('status', '!=', 'Lunas');

        return response()->json([
            'students' => [
                'total' => DB::table('students')->count(),
                'active' => DB::table('students')->where('status', 'Aktif')->count(),
                'inactive' => DB::table('students')->where('status', 'Nonaktif')->count(),
                'graduated' => DB::table('students')->where('status', 'Lulus')->count(),
                'byProgram' => DB::table('students')->selectRaw('program, count(*) as total')->groupBy('program')->orderByDesc('total')->pluck('total', 'program'),
            ],
            'registrations' => [
                'total' => DB::table('registrations')->count(),
                'byStatus' => DB::table('registrations')->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            ],
            'staff' => [
                'tutors' => DB::table('staff')->where('role', 'Tutor')->where('status', 'Aktif')->count(),
                'absentToday' => DB::table('tutor_attendances')->whereIn('status', ['Tidak Hadir', 'Izin', 'Sakit'])->count(),
            ],
            'classes' => [
                'active' => DB::table('rombels')->where('status', 'Aktif')->count(),
                'sessions' => DB::table('schedules')->count(),
                'full' => DB::table('rombels')->whereColumn('students', '>=', 'capacity')->count(),
            ],
            'finance' => [
                'income' => (int) DB::table('payments')->where('status', 'Berhasil')->sum('paid'),
                'expense' => (int) DB::table('expenses')->sum('amount'),
                'billed' => (int) DB::table('bills')->sum(DB::raw('amount - discount')),
                'collected' => (int) DB::table('bills')->sum('paid'),
                'outstanding' => (int) (clone $unpaid)->sum(DB::raw('amount - discount - paid')),
                'unpaidStudents' => (clone $unpaid)->count(),
                'pendingVerification' => DB::table('bills')->where('verification', 'pending')->count(),
            ],
            'notifications' => ['unread' => DB::table('admin_notifications')->where('unread', true)->count()],
            // new vs. left students for each of the last six months
            'growth' => collect(range(5, 0))->map(function (int $back) {
                $from = now()->startOfMonth()->subMonths($back);
                $to = $from->copy()->endOfMonth();

                return [
                    'm' => $from->format('M'),
                    'baru' => DB::table('students')->whereBetween('created_at', [$from, $to])->count(),
                    'keluar' => DB::table('students')->whereIn('status', ['Nonaktif', 'Lulus'])->whereBetween('updated_at', [$from, $to])->count(),
                ];
            })->all(),
        ]);
    }
}
