<?php

use App\Support\Resources;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 10)->default('siswa')->index(); // admin | guru | siswa
            $table->string('phone', 30)->nullable();
            $table->string('status', 10)->default('active');
            $table->string('avatar')->nullable();
            $table->json('profile')->nullable();
        });

        // Flat tables declared in config/resources.php
        foreach (Resources::names() as $name) {
            Schema::create(Resources::table($name), function (Blueprint $table) use ($name) {
                $table->id();
                $table->string('ref', 40)->unique();
                foreach (Resources::columns($name) as $col => $spec) {
                    $column = match ($spec['type']) {
                        's' => $table->string($col, 191)->nullable(),
                        't' => $table->text($col)->nullable(),
                        'i' => $table->integer($col)->default(0),
                        'm' => $table->bigInteger($col)->default(0),
                        'd' => $table->decimal($col, 8, 2)->default(0),
                        'b' => $table->boolean($col)->default(false),
                        'j' => $table->json($col)->nullable(),
                    };
                    if ($spec['nullable'] || $col === 'user_id') {
                        $column->nullable()->default(null);
                    }
                }
                $owner = Resources::ownerColumn($name);
                if ($owner === 'owner_id') {
                    $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
                } elseif ($owner) {
                    $table->index($owner);
                }
                $table->timestamps();
            });
        }

        Schema::table('students', function (Blueprint $table) {
            $table->unique('user_id');
        });
        Schema::table('submissions', function (Blueprint $table) {
            $table->unique(['assignment_id', 'student_id']);
        });
        Schema::table('schedules', function (Blueprint $table) {
            $table->index(['day', 'slot']);
        });

        // Course → module → lesson, with enrollment and per-student progress
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->string('ref', 40)->unique();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('title', 191);
            $table->boolean('locked')->default(false);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('ref', 40)->unique();
            $table->foreignId('module_id')->constrained('course_modules')->cascadeOnDelete();
            $table->string('title', 191);
            $table->string('kind', 20)->default('video'); // video | catatan | contoh | latihan
            $table->string('duration', 40)->nullable();
            $table->string('video_url')->nullable();
            $table->text('about')->nullable();
            $table->json('notes')->nullable();
            $table->json('files')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['student_id', 'course_id']);
        });
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->timestamp('completed_at');
            $table->unique(['student_id', 'lesson_id']);
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key', 60)->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['settings', 'lesson_progress', 'course_enrollments', 'lessons', 'course_modules'] as $table) {
            Schema::dropIfExists($table);
        }
        foreach (array_reverse(Resources::names()) as $name) {
            Schema::dropIfExists(Resources::table($name));
        }
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn(['role', 'phone', 'status', 'avatar', 'profile']));
    }
};
