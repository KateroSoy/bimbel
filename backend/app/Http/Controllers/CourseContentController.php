<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/** Tutor / admin management of course modules, lessons and enrollments (courses themselves are a resource). */
class CourseContentController extends Controller
{
    public function modules(string $course): JsonResponse
    {
        $courseId = $this->courseId($course);
        $modules = DB::table('course_modules')->where('course_id', $courseId)->orderBy('position')->orderBy('id')->get();
        $lessons = DB::table('lessons')->whereIn('module_id', $modules->pluck('id'))->orderBy('position')->orderBy('id')->get()->groupBy('module_id');

        return response()->json(['data' => $modules->map(fn ($m) => $this->module($m) + [
            'lessons' => ($lessons[$m->id] ?? collect())->map(fn ($l) => $this->lesson($l))->values()->all(),
        ])->all()]);
    }

    public function storeModule(Request $request, string $course): JsonResponse
    {
        $courseId = $this->courseId($course);
        $data = $request->validate(['title' => ['required', 'string', 'max:191'], 'locked' => ['sometimes', 'boolean'], 'position' => ['sometimes', 'integer', 'min:0']]);
        $id = DB::table('course_modules')->insertGetId($data + [
            'ref' => 'MOD-'.Str::lower(Str::random(10)), 'course_id' => $courseId,
            'position' => DB::table('course_modules')->where('course_id', $courseId)->count(), 'created_at' => now(), 'updated_at' => now(),
        ]);

        return response()->json(['data' => $this->module(DB::table('course_modules')->find($id))], 201);
    }

    public function updateModule(Request $request, string $module): JsonResponse
    {
        $row = DB::table('course_modules')->where('ref', $module)->first() ?? abort(404);
        $data = $request->validate(['title' => ['sometimes', 'required', 'string', 'max:191'], 'locked' => ['sometimes', 'boolean'], 'position' => ['sometimes', 'integer', 'min:0']]);
        DB::table('course_modules')->where('id', $row->id)->update($data + ['updated_at' => now()]);

        return response()->json(['data' => $this->module(DB::table('course_modules')->find($row->id))]);
    }

    public function destroyModule(string $module): JsonResponse
    {
        abort_unless(DB::table('course_modules')->where('ref', $module)->delete(), 404);

        return response()->json(['ok' => true]);
    }

    public function storeLesson(Request $request, string $module): JsonResponse
    {
        $row = DB::table('course_modules')->where('ref', $module)->first() ?? abort(404);
        $data = $this->lessonInput($request, true);
        $id = DB::table('lessons')->insertGetId($data + [
            'ref' => 'LSN-'.Str::lower(Str::random(10)), 'module_id' => $row->id,
            'position' => DB::table('lessons')->where('module_id', $row->id)->count(), 'created_at' => now(), 'updated_at' => now(),
        ]);

        return response()->json(['data' => $this->lesson(DB::table('lessons')->find($id))], 201);
    }

    public function updateLesson(Request $request, string $lesson): JsonResponse
    {
        $row = DB::table('lessons')->where('ref', $lesson)->first() ?? abort(404);
        DB::table('lessons')->where('id', $row->id)->update($this->lessonInput($request, false) + ['updated_at' => now()]);

        return response()->json(['data' => $this->lesson(DB::table('lessons')->find($row->id))]);
    }

    public function destroyLesson(string $lesson): JsonResponse
    {
        abort_unless(DB::table('lessons')->where('ref', $lesson)->delete(), 404);

        return response()->json(['ok' => true]);
    }

    public function enrollments(string $course): JsonResponse
    {
        $rows = DB::table('course_enrollments')->join('students', 'students.id', '=', 'course_enrollments.student_id')
            ->where('course_enrollments.course_id', $this->courseId($course))->orderBy('students.name')->get(['students.ref', 'students.name']);

        return response()->json(['data' => $rows->map(fn ($r) => ['studentId' => $r->ref, 'name' => $r->name])->all()]);
    }

    public function enroll(Request $request, string $course): JsonResponse
    {
        $courseId = $this->courseId($course);
        $data = $request->validate(['studentId' => ['required', 'string', 'exists:students,ref']]);
        $studentId = DB::table('students')->where('ref', $data['studentId'])->value('id');
        // insertOrIgnore + unique key: enrolling twice leaves a single row
        DB::table('course_enrollments')->insertOrIgnore(['student_id' => $studentId, 'course_id' => $courseId, 'created_at' => now(), 'updated_at' => now()]);

        return response()->json(['ok' => true], 201);
    }

    public function unenroll(Request $request, string $course): JsonResponse
    {
        $data = $request->validate(['studentId' => ['required', 'string', 'exists:students,ref']]);
        DB::table('course_enrollments')->where('course_id', $this->courseId($course))
            ->where('student_id', DB::table('students')->where('ref', $data['studentId'])->value('id'))->delete();

        return response()->json(['ok' => true]);
    }

    private function courseId(string $ref): int
    {
        return DB::table('courses')->where('ref', $ref)->value('id') ?? abort(404);
    }

    private function lessonInput(Request $request, bool $creating): array
    {
        $data = $request->validate([
            'title' => [$creating ? 'required' : 'sometimes', 'string', 'max:191'],
            'kind' => ['sometimes', 'in:video,catatan,contoh,latihan'],
            'duration' => ['sometimes', 'nullable', 'string', 'max:40'],
            'videoUrl' => ['sometimes', 'nullable', 'url', 'max:255'],
            'about' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'notes' => ['sometimes', 'nullable', 'array'],
            'files' => ['sometimes', 'nullable', 'array'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);
        $out = [];
        foreach ($data as $key => $value) {
            $out[Str::snake($key)] = is_array($value) ? json_encode($value) : $value;
        }

        return $out;
    }

    private function module(object $m): array
    {
        return ['id' => $m->ref, 'title' => $m->title, 'locked' => (bool) $m->locked, 'position' => $m->position];
    }

    private function lesson(object $l): array
    {
        return ['id' => $l->ref, 'title' => $l->title, 'kind' => $l->kind, 'duration' => $l->duration, 'videoUrl' => $l->video_url,
            'about' => $l->about, 'notes' => json_decode($l->notes ?? 'null', true), 'files' => json_decode($l->files ?? 'null', true), 'position' => $l->position];
    }
}
