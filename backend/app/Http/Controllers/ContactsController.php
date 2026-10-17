<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Resources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Who a tutor may start a conversation with: students of their classes, the admin team and fellow tutors. */
class ContactsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $me = $request->user();
        $students = Resources::model('class-students')->newQuery()->where('owner_id', $me->id)->orderBy('name')->get(['name', 'kelas'])
            ->map(fn ($s) => ['name' => $s->name, 'role' => 'Siswa', 'sub' => $s->kelas]);
        $tutors = User::query()->where('role', 'guru')->where('id', '!=', $me->id)->where('status', 'active')->orderBy('name')->get(['name'])
            ->map(fn ($u) => ['name' => $u->name, 'role' => 'Tutor', 'sub' => 'Tutor StudyHack']);

        return response()->json(['data' => [
            ['name' => 'Tim Admin StudyHack', 'role' => 'Admin', 'sub' => 'Administrasi & akademik'],
            ...$tutors->all(),
            ...$students->all(),
        ]]);
    }
}
