<?php

namespace App\Support;

use App\Models\Record;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** Business rules attached to specific resources (docs/06-BUSINESS-RULES.md). */
class ResourceHooks
{
    /** Input keys (camelCase) a role may write; null = every declared column. */
    public static function writable(string $name, User $user): ?array
    {
        if ($name === 'submissions') {
            return $user->role === 'siswa' ? ['assignmentId', 'answers', 'fileName'] : ['score', 'feedback', 'status'];
        }

        return null;
    }

    /** Extra constraints appended to the generated rules of a field. */
    public static function rules(string $name): array
    {
        return match ($name) {
            'submissions' => ['score' => ['min:0', 'max:100'], 'status' => ['in:Dinilai,Perlu Dinilai']],
            'schedules' => ['day' => ['between:0,6'], 'slot' => ['between:0,23']],
            'staff', 'guardians', 'students' => ['email' => ['email']],
            default => [],
        };
    }

    /** Adjust or reject column values before they are written. */
    public static function saving(string $name, array $data, User $user, ?Record $existing): array
    {
        return match ($name) {
            'schedules' => self::schedule($data, $existing),
            'bills' => self::bill($data, $existing),
            'submissions' => self::submission($data, $user, $existing),
            default => $data,
        };
    }

    public static function saved(string $name, Record $row): void
    {
        if ($name === 'submissions') {
            Resources::model('assignments')->newQuery()->where('ref', $row->assignment_id)->update([
                'submitted' => Resources::model('submissions')->newQuery()->where('assignment_id', $row->assignment_id)->count(),
            ]);
        }
    }

    /** Shape the API output per role (e.g. hide answer keys from students). */
    public static function present(string $name, array $row, User $user): array
    {
        if ($name === 'assignments' && $user->role === 'siswa' && is_array($row['questions'])) {
            $row['questions'] = array_map(fn ($q) => array_diff_key($q, ['answer' => 1]), $row['questions']);
        }

        return $row;
    }

    private static function schedule(array $data, ?Record $existing): array
    {
        $day = $data['day'] ?? $existing?->day;
        $slot = $data['slot'] ?? $existing?->slot;
        $tutor = $data['tutor'] ?? $existing?->tutor;
        $room = $data['room'] ?? $existing?->room;

        $clash = Resources::model('schedules')->newQuery()
            ->where('day', $day)->where('slot', $slot)
            ->when($existing, fn ($q) => $q->where('id', '!=', $existing->id))
            ->where(fn ($q) => $q->where('tutor', $tutor)->orWhere('room', $room))
            ->first();
        if ($clash) {
            throw ValidationException::withMessages(['slot' => "Jadwal bentrok dengan {$clash->kelas} ({$clash->tutor}, {$clash->room})."]);
        }

        return $data;
    }

    private static function bill(array $data, ?Record $existing): array
    {
        $amount = $data['amount'] ?? $existing?->amount ?? 0;
        $discount = $data['discount'] ?? $existing?->discount ?? 0;
        $paid = min($data['paid'] ?? $existing?->paid ?? 0, max(0, $amount - $discount));
        $data['paid'] = $paid;
        $data['status'] = $paid >= $amount - $discount ? 'Lunas' : ($paid > 0 ? 'Belum Lunas' : 'Terlambat');
        if (! $existing || $paid !== (int) $existing->paid) {
            $data['verification'] = 'none'; // an admin-recorded payment settles any pending student claim
            if ($data['status'] === 'Lunas' && empty($data['paid_at'])) {
                $data['paid_at'] = now()->format('Y-m-d H:i');
            }
        }

        return $data;
    }

    private static function submission(array $data, User $user, ?Record $existing): array
    {
        if ($user->role !== 'siswa') {
            if (! $existing) {
                throw new HttpException(403, 'Hanya siswa yang dapat mengumpulkan tugas.');
            }
            if (array_key_exists('score', $data) && $data['score'] !== null) {
                $data['status'] = 'Dinilai';
            }

            return $data;
        }
        if ($existing) {
            throw new HttpException(403, 'Kirim ulang tugas untuk mengganti pengumpulan.');
        }

        $student = $user->student();
        $assignment = Resources::model('assignments')->newQuery()->where('ref', $data['assignment_id'])->first();
        if (! $student || ! $assignment) {
            throw ValidationException::withMessages(['assignmentId' => 'Tugas tidak ditemukan.']);
        }

        $data += ['answers' => null, 'file_name' => null];
        $data['student_id'] = $student->ref;
        $data['student_name'] = $student->name;
        $data['student_nis'] = $student->ref;
        $data['submitted_at'] = now()->format('d M Y, H:i');
        $data['feedback'] = null;

        // Multiple choice is scored here; the client never sends or sees the answer key.
        $keyed = array_values(array_filter($assignment->questions ?? [], fn ($q) => isset($q['answer'])));
        if ($assignment->mode === 'pilihan-ganda' && $keyed) {
            $answers = $data['answers'] ?? [];
            $correct = 0;
            foreach ($keyed as $q) {
                $given = $answers[$q['id']] ?? $answers[(string) $q['id']] ?? null;
                $correct += ($given !== null && (int) $given === (int) $q['answer']) ? 1 : 0;
            }
            $data['score'] = round($correct / count($keyed) * 100, 2);
            $data['status'] = 'Dinilai';
        } else {
            $data['score'] = null;
            $data['status'] = 'Perlu Dinilai';
        }

        return $data;
    }
}
