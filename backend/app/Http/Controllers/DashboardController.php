<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/** Aggregates for the admin dashboard, computed from the tables on every request. */
class DashboardController extends Controller
{
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
