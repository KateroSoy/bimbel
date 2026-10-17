<?php

namespace App\Http\Controllers;

use App\Support\Resources;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Endpoints the public website calls without a login. */
class PublicController extends Controller
{
    /** Settings the public website may show (no payment or internal data). */
    public function info(): JsonResponse
    {
        $url = DB::table('settings')->where('key', 'appDownloadUrl')->value('value');

        return response()->json(['data' => ['appDownloadUrl' => $url ?: null]]);
    }

    /** Sign-up form on /program/:slug and the landing page; lands in Admin → Pendaftaran Siswa Baru. */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'age' => ['nullable', 'integer', 'min:1', 'max:30'],
            'gender' => ['nullable', 'in:L,P'],
            'program' => ['required', 'string', 'max:191'],
            'parentName' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^[0-9+\-\s()]{8,30}$/'],
            'email' => ['nullable', 'email', 'max:191'],
            'school' => ['nullable', 'string', 'max:191'],
            'level' => ['nullable', 'string', 'max:60'],
            'method' => ['nullable', 'in:Tatap Muka,Online'],
            'note' => ['nullable', 'string', 'max:1000'],
            // Honeypot: real visitors never see this field.
            'website' => ['prohibited'],
        ]);

        $now = now();
        $row = Resources::model('registrations');
        $row->forceFill([
            'date' => $now->format('d/m/Y'),
            'time' => $now->format('H:i'),
            'name' => $data['name'],
            'gender' => $data['gender'] ?? null,
            'age' => $data['age'] ?? 0,
            'program' => $data['program'],
            'source' => 'Website',
            'status' => 'Menunggu Verifikasi',
            'stage' => 'Pengajuan',
            'stage_note' => 'Daftar lewat website',
            'parent_name' => $data['parentName'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'school' => $data['school'] ?? null,
            'level' => $data['level'] ?? null,
            'method' => $data['method'] ?? null,
            'note' => $data['note'] ?? null,
        ]);
        for ($attempt = 0; ; $attempt++) {
            try {
                $row->ref = Resources::nextRef('registrations');
                $row->save();
                break;
            } catch (UniqueConstraintViolationException $e) {
                if ($attempt >= 3) {
                    throw $e;
                }
            }
        }

        $note = Resources::model('admin-notifications');
        $note->forceFill([
            'category' => 'Siswa',
            'title' => "Pendaftar baru: {$data['name']}",
            'desc' => "{$data['program']} · wali {$data['parentName']} ({$data['phone']})",
            'time' => $now->format('d/m/Y H:i'),
            'action' => 'Lihat Pendaftaran',
            'to' => '/admin/pendaftaran',
            'tone' => 'blue',
            'unread' => true,
        ]);
        $note->ref = Resources::nextRef('admin-notifications');
        $note->save();

        return response()->json(['data' => ['id' => $row->ref]], 201);
    }
}
