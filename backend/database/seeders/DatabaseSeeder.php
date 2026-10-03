<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\Resources;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Seeds the three starter accounts and the demo content that used to live in the front-end bundle
 * (database/seeders/data/*.json, produced by scripts/export-seed.ts). Safe to re-run: it does nothing
 * once users exist. Set SEED_PASSWORD before seeding a real server.
 */
class DatabaseSeeder extends Seeder
{
    public const STUDENT_REF = 'SH-00023';

    private array $data = [];

    public function run(): void
    {
        if (User::count() > 0) {
            return;
        }
        foreach (['admin', 'guru', 'siswa', 'store'] as $file) {
            $this->data[$file] = json_decode(file_get_contents(__DIR__."/data/$file.json"), true);
        }
        $password = env('SEED_PASSWORD', 'LearnSpace#2026');
        $tutor = $this->data['guru']['TUTOR'];
        $card = $this->data['siswa']['STUDENT'];

        $this->user('Admin Sekolah', 'admin@studyhack.id', 'admin', $password);
        $guru = $this->user($tutor['name'], $tutor['email'], 'guru', $password, [
            'phone' => $tutor['phone'], 'avatar' => $tutor['avatar'],
            'profile' => ['education' => $tutor['education'], 'joined' => $tutor['joined'], 'org' => $tutor['org'], 'achievements' => $this->data['guru']['ACHIEVEMENTS']],
        ]);
        $siswa = $this->user($card['name'], $card['email'], 'siswa', $password, ['phone' => $card['phone'], 'avatar' => $card['avatar']]);

        foreach (Resources::names() as $name) {
            if ($seed = Resources::def($name)['seed'] ?? null) {
                foreach ($this->data[$seed[0]][$seed[1]] as $row) {
                    $this->insert($name, $row, Resources::ownerColumn($name) === 'owner_id' ? ['owner_id' => $guru->id] : []);
                }
            }
        }

        $this->demoStudent($siswa, $card);
        $this->assignmentContent();
        $this->portalCourses();

        foreach ($this->data['store']['initialSchoolSettings'] as $key => $value) {
            DB::table('settings')->insert(['key' => $key, 'value' => $value, 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    private function user(string $name, string $email, string $role, string $password, array $extra = []): User
    {
        $user = new User(['name' => $name, 'email' => $email, 'password' => $password] + $extra);
        $user->role = $role;
        $user->email_verified_at = now();
        $user->save();

        return $user;
    }

    /** Insert one exported row: `id` becomes the public ref, camelCase keys become columns. */
    private function insert(string $name, array $row, array $extra = []): int
    {
        $values = ['ref' => (string) $row['id'], 'created_at' => now(), 'updated_at' => now()] + $extra;
        foreach (Resources::columns($name) as $col => $spec) {
            $key = Str::camel($col);
            if (array_key_exists($key, $row) && $row[$key] !== null) {
                $values[$col] = $spec['type'] === 'j' ? json_encode($row[$key]) : $row[$key];
            }
        }

        return DB::table(Resources::table($name))->insertGetId($values);
    }

    /** The student account: profile card, subjects, attendance, bills, certificates. */
    private function demoStudent(User $user, array $card): void
    {
        $s = $this->data['siswa'];
        $this->insert('students', [
            'id' => self::STUDENT_REF, 'name' => $card['name'], 'gender' => 'L', 'program' => $card['program'], 'kelas' => $card['level'],
            'dob' => $card['birthDate'], 'age' => (int) $card['age'], 'parent' => $card['parents'][0]['name'], 'phone' => $card['phone'],
            'status' => 'Aktif', 'email' => $card['email'], 'parentPhone' => $card['parents'][0]['phone'],
            'profile' => ['card' => $card, 'achievements' => $s['ACHIEVEMENTS'], 'gradeTrend' => $s['GRADE_TREND'], 'reportSummary' => $s['REPORT_SUMMARY']],
        ], ['user_id' => $user->id]);

        foreach ($s['SUBJECTS'] as $i => $subject) {
            $this->insert('student-subjects', ['id' => 'SS-'.str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT), 'subjectId' => $subject['id'],
                'studentRef' => self::STUDENT_REF, 'description' => $s['SUBJECT_DESCRIPTIONS'][$subject['id']] ?? null] + $subject);
        }
        foreach ($s['ATTENDANCE'] as $row) {
            $this->insert('student-attendances', ['studentRef' => self::STUDENT_REF] + $row);
        }
        // oldest first, so the newest bill gets the highest id and is listed first
        foreach (array_reverse($s['BILLS']) as $bill) {
            $paid = $bill['status'] === 'Lunas' ? $bill['amount'] : 0;
            $this->insert('bills', [
                'id' => $bill['id'], 'name' => $card['name'], 'program' => $card['programShort'], 'kelas' => $card['level'], 'amount' => $bill['amount'],
                'discount' => 0, 'paid' => $paid, 'due' => $bill['dueDate'], 'status' => $paid ? 'Lunas' : 'Terlambat', 'studentRef' => self::STUDENT_REF,
                'title' => $bill['title'], 'description' => $bill['description'], 'invoice' => $bill['invoice'], 'periodMonth' => $bill['month'],
                'periodYear' => $bill['year'], 'method' => $bill['method'] ?? null, 'paidAt' => $bill['paidAt'] ?? null,
                'verification' => $bill['status'] === 'Menunggu Verifikasi' ? 'pending' : 'none',
            ]);
        }
        DB::table('certificates')->update(['student_ref' => self::STUDENT_REF, 'recipient_name' => $card['name']]);
        // The exported demo submissions belonged to the hard-coded student id "1001"
        DB::table('submissions')->where('student_id', '1001')->update(['student_id' => self::STUDENT_REF, 'student_nis' => self::STUDENT_REF, 'student_name' => $card['name']]);
    }

    /** Question content per assignment (was TASK_CONTENT in the front end). */
    private function assignmentContent(): void
    {
        $content = $this->data['siswa']['TASK_CONTENT'];
        foreach (DB::table('assignments')->get() as $assignment) {
            $task = $content[$assignment->ref] ?? ($assignment->type === 'quiz' ? ['mode' => 'pilihan-ganda', 'questions' => $content['3']['questions']] : ['mode' => 'file']);
            DB::table('assignments')->where('id', $assignment->id)->update([
                'mode' => $task['mode'], 'accept' => $task['accept'] ?? null,
                'questions' => isset($task['questions']) ? json_encode($task['questions']) : null,
            ]);
        }
    }

    /** Portal courses with modules, lessons, the demo student's enrollment and completed lessons. */
    private function portalCourses(): void
    {
        $studentId = DB::table('students')->where('ref', self::STUDENT_REF)->value('id');
        $tutors = collect($this->data['siswa']['SUBJECTS'])->pluck('tutor', 'id');

        foreach ($this->data['siswa']['COURSES'] as $course) {
            $chapters = $course['chapters'];
            $courseId = $this->insert('courses', $course + [
                'status' => 'Published', 'instructor' => $tutors[$course['subjectId']] ?? null,
                'lessons' => array_sum(array_map(fn ($c) => count($c['lessons']), $chapters)), 'students' => 1,
            ]);
            DB::table('course_enrollments')->insert(['student_id' => $studentId, 'course_id' => $courseId, 'created_at' => now(), 'updated_at' => now()]);

            foreach ($chapters as $position => $chapter) {
                $moduleId = DB::table('course_modules')->insertGetId([
                    'ref' => $chapter['id'], 'course_id' => $courseId, 'title' => $chapter['title'], 'locked' => $chapter['locked'] ?? false,
                    'position' => $position, 'created_at' => now(), 'updated_at' => now(),
                ]);
                foreach ($chapter['lessons'] as $order => $lesson) {
                    $lessonId = DB::table('lessons')->insertGetId([
                        'ref' => $lesson['id'], 'module_id' => $moduleId, 'title' => $lesson['title'], 'kind' => $lesson['kind'], 'duration' => $lesson['duration'],
                        'video_url' => $lesson['videoUrl'] ?? null, 'about' => $lesson['about'], 'notes' => isset($lesson['notes']) ? json_encode($lesson['notes']) : null,
                        'files' => isset($lesson['files']) ? json_encode($lesson['files']) : null, 'position' => $order, 'created_at' => now(), 'updated_at' => now(),
                    ]);
                    if ($lesson['done']) {
                        DB::table('lesson_progress')->insert(['student_id' => $studentId, 'lesson_id' => $lessonId, 'completed_at' => now()]);
                    }
                }
            }
        }
    }
}
