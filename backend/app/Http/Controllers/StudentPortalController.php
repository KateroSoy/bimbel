<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Support\Resources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Everything the student portal shows, for the authenticated student only. */
class StudentPortalController extends Controller
{
    private const PUBLISHED = ['Aktif', 'Published'];

    public function portal(Request $request): JsonResponse
    {
        $student = $this->student($request);
        $profile = $student->profile ?? [];
        $own = fn (string $resource) => Resources::model($resource)->newQuery()->where('student_ref', $student->ref);

        $subjects = $own('student-subjects')->orderBy('id')->get();
        $bills = $own('bills')->orderByDesc('id')->get();

        return response()->json([
            'student' => array_merge($profile['card'] ?? [], [
                'id' => $student->ref, 'name' => $student->name, 'email' => $student->email, 'phone' => $student->phone,
                'program' => $student->program ?: ($profile['card']['program'] ?? ''), 'level' => $student->kelas ?: ($profile['card']['level'] ?? ''),
            ]),
            'subjects' => $subjects->map(fn (Record $s) => [
                'id' => $s->subject_id, 'name' => $s->name, 'short' => $s->short, 'color' => $s->color, 'soft' => $s->soft, 'tutor' => $s->tutor,
                'tutorAvatar' => $s->tutor_avatar, 'days' => $s->days, 'time' => $s->time, 'progress' => $s->progress, 'score' => $s->score,
                'trend' => $s->trend, 'predikat' => $s->predikat, 'status' => $s->status, 'className' => $s->class_name,
            ])->all(),
            'subjectDescriptions' => $subjects->pluck('description', 'subject_id'),
            'liveClasses' => Resources::model('live-classes')->newQuery()->whereIn('subject_id', $subjects->pluck('subject_id'))->orderBy('id')->get()
                ->map(fn (Record $r) => Resources::present('live-classes', $r))->all(),
            'courses' => $this->courses($student),
            'attendance' => $own('student-attendances')->orderBy('id')->get()->map(fn (Record $r) => array_diff_key(Resources::present('student-attendances', $r), ['studentRef' => 1]))->all(),
            'bills' => $bills->map(fn (Record $b) => $this->bill($b))->all(),
            'announcements' => Resources::model('announcements')->newQuery()->orderByDesc('id')->limit(3)->get()
                ->map(fn (Record $a) => ['title' => $a->title, 'desc' => $a->body, 'date' => $a->date])->all(),
            'achievements' => $profile['achievements'] ?? [],
            'gradeTrend' => $profile['gradeTrend'] ?? [],
            'reportSummary' => $profile['reportSummary'] ?? null,
        ]);
    }

    public function completeLesson(Request $request, string $lesson): JsonResponse
    {
        $student = $this->student($request);
        $row = $this->accessibleLesson($student, $lesson);
        DB::table('lesson_progress')->updateOrInsert(['student_id' => $student->id, 'lesson_id' => $row->id], ['completed_at' => now()]);
        DB::table('courses')->where('id', $row->course_id)->update(['last_studied' => now()->format('Y-m-d H:i')]);

        return response()->json(['courses' => $this->courses($student)]);
    }

    public function uncompleteLesson(Request $request, string $lesson): JsonResponse
    {
        $student = $this->student($request);
        $row = $this->accessibleLesson($student, $lesson);
        DB::table('lesson_progress')->where(['student_id' => $student->id, 'lesson_id' => $row->id])->delete();

        return response()->json(['courses' => $this->courses($student)]);
    }

    /** Student reports a payment; the bill waits for admin verification. */
    public function payBill(Request $request, string $bill): JsonResponse
    {
        $student = $this->student($request);
        $data = $request->validate(['method' => ['required', 'string', 'max:60']]);
        $row = Resources::model('bills')->newQuery()->where('student_ref', $student->ref)->where('ref', $bill)->firstOrFail();
        abort_if($row->status === 'Lunas', 422, 'Tagihan ini sudah lunas.');
        $row->forceFill(['verification' => 'pending', 'method' => $data['method'], 'paid_at' => now()->format('Y-m-d H:i')])->save();

        return response()->json(['bill' => $this->bill($row)]);
    }

    private function student(Request $request): Record
    {
        $student = $request->user()->student();
        abort_unless($student, 403, 'Akun ini belum terhubung dengan data siswa.');

        return $student;
    }

    /** Lesson joined to its course, only if the student is enrolled and the course is published. */
    private function accessibleLesson(Record $student, string $ref): object
    {
        $row = DB::table('lessons')
            ->join('course_modules', 'course_modules.id', '=', 'lessons.module_id')
            ->join('courses', 'courses.id', '=', 'course_modules.course_id')
            ->where('lessons.ref', $ref)
            ->select('lessons.id', 'course_modules.course_id', 'course_modules.locked', 'courses.status')
            ->first();
        abort_unless($row, 404);
        $enrolled = DB::table('course_enrollments')->where(['student_id' => $student->id, 'course_id' => $row->course_id])->exists();
        abort_unless($enrolled && in_array($row->status, self::PUBLISHED, true) && ! $row->locked, 403, 'Materi ini belum dapat diakses.');

        return $row;
    }

    /** Enrolled, published courses as course → chapters → lessons with this student's completion. */
    private function courses(Record $student): array
    {
        $courses = DB::table('courses')
            ->join('course_enrollments', 'course_enrollments.course_id', '=', 'courses.id')
            ->where('course_enrollments.student_id', $student->id)
            ->whereIn('courses.status', self::PUBLISHED)
            ->orderBy('courses.id')
            ->get(['courses.id', 'courses.ref', 'courses.subject_id', 'courses.title', 'courses.category', 'courses.level', 'courses.description', 'courses.last_studied']);
        $modules = DB::table('course_modules')->whereIn('course_id', $courses->pluck('id'))->orderBy('position')->orderBy('id')->get()->groupBy('course_id');
        $lessons = DB::table('lessons')->whereIn('module_id', $modules->flatten()->pluck('id'))->orderBy('position')->orderBy('id')->get()->groupBy('module_id');
        $done = DB::table('lesson_progress')->where('student_id', $student->id)->pluck('lesson_id')->flip();

        return $courses->map(fn ($c) => [
            'id' => $c->ref, 'subjectId' => $c->subject_id, 'title' => $c->title, 'category' => $c->category, 'level' => $c->level,
            'description' => $c->description, 'lastStudied' => $c->last_studied,
            'chapters' => ($modules[$c->id] ?? collect())->map(fn ($m) => [
                'id' => $m->ref, 'title' => $m->title, 'locked' => (bool) $m->locked,
                'lessons' => ($lessons[$m->id] ?? collect())->map(fn ($l) => [
                    'id' => $l->ref, 'title' => $l->title, 'kind' => $l->kind, 'duration' => $l->duration, 'done' => $done->has($l->id),
                    'videoUrl' => $l->video_url, 'about' => $l->about, 'notes' => json_decode($l->notes ?? 'null', true), 'files' => json_decode($l->files ?? 'null', true),
                ])->values()->all(),
            ])->values()->all(),
        ])->all();
    }

    private function bill(Record $b): array
    {
        return [
            'id' => $b->ref, 'invoice' => $b->invoice, 'month' => $b->period_month, 'year' => $b->period_year, 'title' => $b->title ?: $b->program,
            'description' => $b->description, 'amount' => $b->amount - $b->discount, 'dueDate' => $b->due,
            'status' => $b->status === 'Lunas' ? 'Lunas' : ($b->verification === 'pending' ? 'Menunggu Verifikasi' : 'Belum Dibayar'),
            'paidAt' => $b->paid_at, 'method' => $b->method,
        ];
    }
}
