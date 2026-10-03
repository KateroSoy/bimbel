<?php

namespace Tests\Feature;

use App\Models\Record;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LearningTest extends TestCase
{
    use RefreshDatabase;

    /** Course with one module and $lessons lessons, built through the API as a tutor. */
    private function course(int $lessons = 2, string $status = 'Published'): array
    {
        $this->actingAsRole('guru');
        $course = $this->postJson('/api/r/courses', ['title' => 'Matematika P3', 'status' => $status, 'subjectId' => 'math'])->assertCreated()->json('data.id');
        $module = $this->postJson("/api/courses/$course/modules", ['title' => 'Bab 1'])->assertCreated()->json('data.id');
        $ids = [];
        for ($i = 1; $i <= $lessons; $i++) {
            $ids[] = $this->postJson("/api/modules/$module/lessons", ['title' => "Materi $i", 'kind' => 'video', 'duration' => '10 menit'])->assertCreated()->json('data.id');
        }

        return [$course, $module, $ids];
    }

    private function enroll(string $course, Record $student): void
    {
        $this->actingAsRole('admin');
        $this->postJson("/api/courses/$course/enrollments", ['studentId' => $student->ref])->assertCreated();
    }

    public function test_tutor_manages_modules_and_lessons(): void
    {
        [$course, $module, [$lesson]] = $this->course(1);

        $this->assertDatabaseHas('course_modules', ['ref' => $module, 'title' => 'Bab 1']);
        $this->assertDatabaseHas('lessons', ['ref' => $lesson, 'title' => 'Materi 1', 'kind' => 'video']);
        $this->postJson("/api/modules/$module/lessons", ['kind' => 'video'])->assertStatus(422);
        $this->postJson("/api/modules/$module/lessons", ['title' => 'X', 'kind' => 'podcast'])->assertStatus(422);

        $this->putJson("/api/modules/$module", ['title' => 'Bab Satu', 'locked' => true])->assertOk()->assertJsonPath('data.locked', true);
        $this->putJson("/api/lessons/$lesson", ['title' => 'Materi Baru', 'notes' => ['a', 'b']])->assertOk()->assertJsonPath('data.notes.1', 'b');
        $this->assertDatabaseHas('lessons', ['ref' => $lesson, 'title' => 'Materi Baru']);
        $this->getJson("/api/courses/$course/modules")->assertOk()->assertJsonPath('data.0.title', 'Bab Satu')->assertJsonPath('data.0.lessons.0.title', 'Materi Baru');

        $this->deleteJson("/api/lessons/$lesson")->assertOk();
        $this->assertDatabaseMissing('lessons', ['ref' => $lesson]);
        $this->deleteJson("/api/lessons/$lesson")->assertNotFound();
    }

    public function test_deleting_a_course_cascades(): void
    {
        [$course, , [$lesson]] = $this->course(1);
        [$user, $student] = $this->makeStudent();
        $this->enroll($course, $student);
        Sanctum::actingAs($user);
        $this->postJson("/api/student/lessons/$lesson/complete")->assertOk();

        $this->actingAsRole('admin');
        $this->deleteJson("/api/r/courses/$course")->assertOk();

        foreach (['course_modules', 'lessons', 'course_enrollments', 'lesson_progress'] as $table) {
            $this->assertDatabaseCount($table, 0);
        }
    }

    public function test_enrolling_twice_keeps_one_row(): void
    {
        [$course] = $this->course(1);
        [, $student] = $this->makeStudent();

        $this->enroll($course, $student);
        $this->enroll($course, $student);
        $this->assertDatabaseCount('course_enrollments', 1);
        $this->getJson("/api/courses/$course/enrollments")->assertOk()->assertJsonCount(1, 'data');

        $this->postJson("/api/courses/$course/enrollments", ['studentId' => 'tidak-ada'])->assertStatus(422);
        $this->deleteJson("/api/courses/$course/enrollments", ['studentId' => $student->ref])->assertOk();
        $this->assertDatabaseCount('course_enrollments', 0);
    }

    public function test_completing_lessons_drives_progress(): void
    {
        [$course, , [$first, $second]] = $this->course(2);
        [$user, $student] = $this->makeStudent();
        $this->enroll($course, $student);
        Sanctum::actingAs($user);

        $portal = $this->getJson('/api/student/portal')->assertOk()->json();
        $this->assertSame([false, false], array_column($portal['courses'][0]['chapters'][0]['lessons'], 'done'));

        $this->postJson("/api/student/lessons/$first/complete")->assertOk()->assertJsonPath('courses.0.chapters.0.lessons.0.done', true)->assertJsonPath('courses.0.chapters.0.lessons.1.done', false);
        $this->postJson("/api/student/lessons/$first/complete")->assertOk(); // idempotent
        $this->assertDatabaseCount('lesson_progress', 1);
        $this->assertDatabaseHas('lesson_progress', ['student_id' => $student->id, 'lesson_id' => DB::table('lessons')->where('ref', $first)->value('id')]);

        $this->postJson("/api/student/lessons/$second/complete")->assertOk();
        $done = array_column($this->getJson('/api/student/portal')->json('courses.0.chapters.0.lessons'), 'done');
        $this->assertSame(100, (int) round(count(array_filter($done)) / count($done) * 100));

        $this->deleteJson("/api/student/lessons/$second/complete")->assertOk()->assertJsonPath('courses.0.chapters.0.lessons.1.done', false);
        $this->assertDatabaseCount('lesson_progress', 1);
    }

    public function test_lessons_need_enrollment_a_published_course_and_an_unlocked_module(): void
    {
        [$course, $module, [$lesson]] = $this->course(1);
        [$draftCourse, , [$draftLesson]] = $this->course(1, 'Draft');
        [$user, $student] = $this->makeStudent();

        Sanctum::actingAs($user);
        $this->postJson("/api/student/lessons/$lesson/complete")->assertForbidden();
        $this->postJson('/api/student/lessons/tidak-ada/complete')->assertNotFound();
        $this->getJson('/api/student/portal')->assertOk()->assertJsonCount(0, 'courses');

        $this->enroll($course, $student);
        $this->enroll($draftCourse, $student);
        Sanctum::actingAs($user);
        $this->postJson("/api/student/lessons/$draftLesson/complete")->assertForbidden();
        $this->getJson('/api/student/portal')->assertOk()->assertJsonCount(1, 'courses');

        $this->actingAsRole('guru');
        $this->putJson("/api/modules/$module", ['locked' => true])->assertOk();
        Sanctum::actingAs($user);
        $this->postJson("/api/student/lessons/$lesson/complete")->assertForbidden();
        $this->assertDatabaseCount('lesson_progress', 0);
    }

    public function test_multiple_choice_is_scored_on_the_server_and_keys_stay_hidden(): void
    {
        $this->actingAsRole('guru');
        $questions = [
            ['id' => 1, 'question' => '1 + 1', 'options' => ['1', '2', '3'], 'answer' => 1],
            ['id' => 2, 'question' => '2 + 2', 'options' => ['4', '5', '6'], 'answer' => 0],
            ['id' => 3, 'question' => '3 + 3', 'options' => ['5', '6', '7'], 'answer' => 1],
            ['id' => 4, 'question' => '4 + 4', 'options' => ['8', '9', '7'], 'answer' => 0],
        ];
        $quiz = $this->postJson('/api/r/assignments', ['title' => 'Kuis', 'type' => 'quiz', 'mode' => 'pilihan-ganda', 'questions' => $questions, 'total' => 10, 'status' => 'Aktif'])->assertCreated()->json('data.id');
        $this->getJson('/api/r/assignments')->assertJsonPath('data.0.questions.0.answer', 1);

        [$user, $student] = $this->makeStudent('Andi');
        Sanctum::actingAs($user);
        $seen = $this->getJson('/api/r/assignments')->assertOk()->json('data.0.questions');
        $this->assertArrayNotHasKey('answer', $seen[0]);
        $this->assertSame('1 + 1', $seen[0]['question']);

        // 3 of 4 correct; the client also tries to dictate identity, score and status
        $this->postJson('/api/r/submissions', [
            'assignmentId' => $quiz, 'answers' => ['1' => 1, '2' => 0, '3' => 1, '4' => 2],
            'score' => 100, 'status' => 'Dinilai', 'studentId' => 'ORANG-LAIN', 'studentName' => 'Palsu',
        ])->assertCreated()->assertJsonPath('data.score', 75)->assertJsonPath('data.status', 'Dinilai')->assertJsonPath('data.studentName', 'Andi');
        $this->assertDatabaseHas('submissions', ['assignment_id' => $quiz, 'student_id' => $student->ref, 'score' => 75]);
        $this->assertDatabaseHas('assignments', ['ref' => $quiz, 'submitted' => 1]);

        // re-submit replaces the row
        $this->postJson('/api/r/submissions', ['assignmentId' => $quiz, 'answers' => ['1' => 1, '2' => 0, '3' => 1, '4' => 0]])->assertOk()->assertJsonPath('data.score', 100);
        $this->assertDatabaseCount('submissions', 1);
        $this->assertDatabaseHas('assignments', ['ref' => $quiz, 'submitted' => 1]);

        $this->postJson('/api/r/submissions', ['assignmentId' => 'tidak-ada'])->assertStatus(422);
        $this->postJson('/api/r/submissions', [])->assertStatus(422);
    }

    public function test_tutor_grades_file_submissions_and_students_cannot(): void
    {
        $this->actingAsRole('guru');
        $task = $this->postJson('/api/r/assignments', ['title' => 'Esai', 'type' => 'tugas', 'mode' => 'file', 'status' => 'Aktif'])->json('data.id');
        $this->postJson('/api/r/submissions', ['assignmentId' => $task])->assertForbidden();

        [$user] = $this->makeStudent();
        Sanctum::actingAs($user);
        $submission = $this->postJson('/api/r/submissions', ['assignmentId' => $task, 'fileName' => 'esai.pdf'])->assertCreated()
            ->assertJsonPath('data.status', 'Perlu Dinilai')->assertJsonPath('data.score', null)->json('data.id');
        $this->putJson("/api/r/submissions/$submission", ['score' => 100])->assertForbidden();
        $this->deleteJson("/api/r/submissions/$submission")->assertForbidden();

        $this->actingAsRole('guru');
        $this->putJson("/api/r/submissions/$submission", ['score' => 101])->assertStatus(422);
        $this->putJson("/api/r/submissions/$submission", ['score' => 88, 'feedback' => 'Bagus', 'studentName' => 'Diubah'])->assertOk()
            ->assertJsonPath('data.status', 'Dinilai')->assertJsonPath('data.score', 88);
        $this->assertDatabaseHas('submissions', ['ref' => $submission, 'score' => 88, 'feedback' => 'Bagus', 'status' => 'Dinilai']);
        $this->assertDatabaseMissing('submissions', ['student_name' => 'Diubah']);

        Sanctum::actingAs($user);
        $this->getJson('/api/r/submissions')->assertOk()->assertJsonPath('data.0.score', 88)->assertJsonPath('data.0.feedback', 'Bagus');
    }

    public function test_portal_returns_only_the_students_own_data(): void
    {
        [$user, $student] = $this->makeStudent('Andi');
        [, $other] = $this->makeStudent('Lain');
        $student->forceFill(['kelas' => 'Primary 3', 'profile' => ['card' => ['school' => 'SD 03'], 'achievements' => [['title' => 'Juara', 'desc' => '2025']]]])->save();
        foreach ([[$student, 'Hadir'], [$other, 'Alpha']] as [$owner, $status]) {
            $this->makeRow('student-subjects', ['student_ref' => $owner->ref, 'subject_id' => 'math', 'name' => 'Mathematics', 'score' => 85, 'description' => 'Baik']);
            $this->makeRow('student-attendances', ['student_ref' => $owner->ref, 'subject_id' => 'math', 'status' => $status]);
            $this->makeRow('bills', ['student_ref' => $owner->ref, 'name' => $owner->name, 'title' => 'SPP', 'amount' => 300000, 'status' => 'Terlambat', 'verification' => 'none']);
        }
        $this->makeRow('live-classes', ['subject_id' => 'math', 'topic' => 'Bilangan']);
        $this->makeRow('live-classes', ['subject_id' => 'kimia', 'topic' => 'Bukan mapelnya']);

        Sanctum::actingAs($user);
        $this->getJson('/api/student/portal')->assertOk()
            ->assertJsonPath('student.name', 'Andi')->assertJsonPath('student.level', 'Primary 3')->assertJsonPath('student.school', 'SD 03')
            ->assertJsonCount(1, 'subjects')->assertJsonPath('subjects.0.id', 'math')->assertJsonPath('subjectDescriptions.math', 'Baik')
            ->assertJsonCount(1, 'attendance')->assertJsonPath('attendance.0.status', 'Hadir')
            ->assertJsonCount(1, 'bills')->assertJsonPath('bills.0.status', 'Belum Dibayar')->assertJsonPath('bills.0.amount', 300000)
            ->assertJsonCount(1, 'liveClasses')->assertJsonPath('achievements.0.title', 'Juara');
    }

    public function test_account_without_student_record_cannot_open_the_portal(): void
    {
        Sanctum::actingAs($this->makeUser('siswa'));

        $this->getJson('/api/student/portal')->assertForbidden();
    }
}
