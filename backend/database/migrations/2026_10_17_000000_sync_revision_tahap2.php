<?php

use App\Support\Resources;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Revisi tahap 2: brings an existing database up to config/resources.php — new tables
 * (placement-tests, alumni) and new columns (registration contact, class mode, question folder).
 * On a fresh install the create migration already builds everything, so this is a no-op there.
 */
return new class extends Migration
{
    private const TABLES = ['placement-tests', 'alumni'];

    private const COLUMNS = [
        'registrations' => ['parent_name', 'phone', 'email', 'school', 'level', 'method', 'note'],
        'live-classes' => ['mode'],
        'tutor-classes' => ['mode', 'meet_url', 'room'],
        'questions' => ['folder'],
    ];

    public function up(): void
    {
        foreach (self::TABLES as $name) {
            if (Schema::hasTable(Resources::table($name))) {
                continue;
            }
            Schema::create(Resources::table($name), function (Blueprint $table) use ($name) {
                $table->id();
                $table->string('ref', 40)->unique();
                foreach (Resources::columns($name) as $col => $spec) {
                    $this->column($table, $col, $spec['type']);
                }
                $table->timestamps();
            });
        }

        foreach (self::COLUMNS as $name => $cols) {
            $table = Resources::table($name);
            $specs = Resources::columns($name);
            $missing = array_values(array_filter($cols, fn ($col) => ! Schema::hasColumn($table, $col)));
            if ($missing) {
                Schema::table($table, function (Blueprint $t) use ($missing, $specs) {
                    foreach ($missing as $col) {
                        $this->column($t, $col, $specs[$col]['type']);
                    }
                });
            }
        }
    }

    public function down(): void
    {
        foreach (self::COLUMNS as $name => $cols) {
            $table = Resources::table($name);
            $present = array_values(array_filter($cols, fn ($col) => Schema::hasColumn($table, $col)));
            if ($present) {
                Schema::table($table, fn (Blueprint $t) => $t->dropColumn($present));
            }
        }
        foreach (self::TABLES as $name) {
            Schema::dropIfExists(Resources::table($name));
        }
    }

    /** Same column mapping as the create migration. */
    private function column(Blueprint $table, string $col, string $type): void
    {
        match ($type) {
            's' => $table->string($col, 191)->nullable(),
            't' => $table->text($col)->nullable(),
            'i' => $table->integer($col)->default(0),
            'm' => $table->bigInteger($col)->default(0),
            'd' => $table->decimal($col, 8, 2)->default(0),
            'b' => $table->boolean($col)->default(false),
            'j' => $table->json($col)->nullable(),
        };
    }
};
