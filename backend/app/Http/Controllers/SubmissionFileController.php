<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Support\ResourceHooks;
use App\Support\Resources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubmissionFileController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $input = $request->validate([
            'assignmentId' => ['required', 'string', 'max:40'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:20480'],
        ]);
        $user = $request->user();
        $student = $user->student();
        abort_unless($student, 403);
        $assignment = Resources::model('assignments')->newQuery()->where('ref', $input['assignmentId'])->first();
        if (! $assignment || ($assignment->mode ?? ($assignment->type === 'quiz' ? 'pilihan-ganda' : 'file')) !== 'file' || $assignment->status !== 'Aktif') {
            throw ValidationException::withMessages(['assignmentId' => 'Tugas upload tidak tersedia.']);
        }

        $file = $request->file('file');
        $name = Str::limit(basename(str_replace('\\', '/', $file->getClientOriginalName())), 190, '');
        $path = $file->store('submissions/'.$student->id, 'local');
        if (! $path) {
            abort(500, 'Berkas gagal disimpan.');
        }

        $row = Resources::model('submissions')->newQuery()
            ->where('assignment_id', $assignment->ref)->where('student_id', $student->ref)->first();
        $replaced = (bool) $row;
        $oldPath = $row?->file_path;
        try {
            $data = ResourceHooks::saving('submissions', [
                'assignment_id' => $assignment->ref,
                'file_name' => $name,
                'file_path' => $path,
            ], $user, null);
            $row ??= Resources::model('submissions');
            if (! $row->exists) {
                $row->ref = Resources::nextRef('submissions');
            }
            $row->forceFill($data)->save();
            ResourceHooks::saved('submissions', $row);
        } catch (\Throwable $e) {
            Storage::disk('local')->delete($path);
            throw $e;
        }
        if ($oldPath) {
            Storage::disk('local')->delete($oldPath);
        }

        return response()->json(['data' => ResourceHooks::present('submissions', Resources::present('submissions', $row->refresh()), $user) + ['hasFile' => true]], $replaced ? 200 : 201);
    }

    public function download(Request $request, string $submission): StreamedResponse
    {
        $row = Resources::model('submissions')->newQuery()->where('ref', $submission)->firstOrFail();
        $user = $request->user();
        if ($user->role === 'siswa') {
            abort_unless($row->student_id === $user->student()?->ref, 403);
        } else {
            abort_unless(in_array($user->role, ['admin', 'guru'], true), 403);
        }
        abort_unless($row->file_path && Storage::disk('local')->exists($row->file_path), 404);

        return Storage::disk('local')->download($row->file_path, $row->file_name ?: 'tugas');
    }
}
