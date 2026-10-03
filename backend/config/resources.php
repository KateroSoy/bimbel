<?php

/*
|--------------------------------------------------------------------------
| Resource registry
|--------------------------------------------------------------------------
| Each entry is a flat table exposed through /api/r/{name} by ResourceController.
| The same definition drives the migration, validation, access control, seeding
| and docs/04-DATABASE-SCHEMA.md, so a column only has to be declared once.
|
| cols   "name:type" list. Types: s string(191) · t text · i integer · m bigInteger (rupiah)
|        · d decimal(8,2) · b boolean · j json. JSON keys are the camelCase of the column.
| req    required columns on create.
| search columns matched by ?q=.
| read / write   roles allowed.
| owner  'tutor'   → rows carry owner_id; a guru only sees and edits their own.
|        'student' → rows carry student_ref; a siswa only sees their own.
| ref    [prefix, zero-pad] for the generated public id (returned as "id").
| seed   [json file, key] imported by DatabaseSeeder.
*/

$all = ['admin', 'guru', 'siswa'];
$staff = ['admin', 'guru'];
$admin = ['admin'];

return [
    // ---------------------------------------------------------------- Admin: people
    'students' => [
        'cols' => 'name:s gender:s program:s kelas:s dob:s age:i parent:s phone:s status:s email:s gpa:d attendance:s parent_phone:s profile:j user_id:i',
        'req' => ['name'], 'search' => ['name', 'ref', 'parent'], 'read' => $staff, 'write' => $admin,
        'ref' => ['24', 5], 'seed' => ['admin', 'STUDENTS'],
    ],
    'registrations' => [
        'cols' => 'date:s time:s name:s gender:s age:i program:s source:s status:s stage:s stage_note:s',
        'req' => ['name'], 'search' => ['name', 'ref'], 'read' => $admin, 'write' => $admin,
        'ref' => ['REG-', 4], 'seed' => ['admin', 'REGISTRATIONS'],
    ],
    'guardians' => [
        'cols' => 'name:s child:s relation:s phone:s email:s address:t status:s',
        'req' => ['name'], 'search' => ['name', 'phone', 'email', 'child'], 'read' => $admin, 'write' => $admin,
        'ref' => ['ORT-', 4], 'seed' => ['admin', 'PARENTS'],
    ],
    'staff' => [
        'cols' => 'name:s email:s role:s programs:j program:s phone:s status:s joined:s avatar:s',
        'req' => ['name'], 'search' => ['name', 'ref', 'phone', 'email'], 'read' => $admin, 'write' => $admin,
        'ref' => ['STF-', 3], 'seed' => ['admin', 'STAFF'],
    ],
    'tutor-attendances' => [
        'cols' => 'name:s program:s code:s room:s schedule:s check_in:s check_out:s status:s note:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $admin, 'write' => $admin,
        'ref' => ['ATT-', 4], 'seed' => ['admin', 'TUTOR_ATTENDANCE'],
    ],
    'workloads' => [
        'cols' => 'name:s classes:j class_count:i hours:s sessions:d pct:d status:s note:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $admin, 'write' => $admin,
        'ref' => ['WL-', 3], 'seed' => ['admin', 'WORKLOADS'],
    ],

    // ---------------------------------------------------------------- Admin: program & kelas
    'programs' => [
        'cols' => 'name:s level:s category:s desc:t sessions:i minutes:i fee:m classes:i students:i status:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $admin, 'write' => $admin,
        'ref' => ['PRG-', 2], 'seed' => ['admin', 'PROGRAMS'],
    ],
    'class-levels' => [
        'cols' => 'name:s sub:s level:s rombel:i students:i capacity:i status:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $admin, 'write' => $admin,
        'ref' => ['KLS-', 2], 'seed' => ['admin', 'LEVELS'],
    ],
    'rombels' => [
        'cols' => 'name:s level:s tutor:s room:s students:i capacity:i status:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $admin, 'write' => $admin,
        'ref' => ['RMB-', 2], 'seed' => ['admin', 'ROMBELS'],
    ],
    'rooms' => [
        'cols' => 'name:s type:s floor:s capacity:i used:i status:s condition:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $admin, 'write' => $admin,
        'ref' => ['RNG-', 2], 'seed' => ['admin', 'ROOMS'],
    ],
    'schedules' => [
        'cols' => 'day:i slot:i kelas:s room:s tutor:s fill:s',
        'req' => ['kelas', 'day', 'slot'], 'search' => ['kelas', 'tutor', 'room'], 'read' => $staff, 'write' => $admin,
        'ref' => ['JDW-', 3], 'seed' => ['admin', 'SCHEDULE'],
    ],

    // ---------------------------------------------------------------- Admin: keuangan
    'bills' => [
        'cols' => 'name:s program:s kelas:s amount:m discount:m paid:m due:s status:s student_ref:s title:s description:s invoice:s period_month:s period_year:s method:s paid_at:s verification:s',
        'req' => ['name', 'amount'], 'search' => ['name', 'ref'], 'read' => ['admin', 'siswa'], 'write' => $admin,
        'owner' => 'student', 'ref' => ['BILL-', 5], 'seed' => ['admin', 'BILLS'],
    ],
    'payments' => [
        'cols' => 'date:s time:s name:s sid:s program:s method:s channel:s bill:m paid:m discount:m status:s',
        'req' => ['name'], 'search' => ['name', 'ref', 'sid'], 'read' => $admin, 'write' => $admin,
        'ref' => ['TRX-', 6], 'seed' => ['admin', 'PAYMENTS'],
    ],
    'debts' => [
        'cols' => 'name:s program:s total:m paid:m due:s late:i status:s',
        'req' => ['name'], 'search' => ['name', 'program'], 'read' => $admin, 'write' => $admin,
        'ref' => ['PIU-', 4], 'seed' => ['admin', 'DEBTS'],
    ],
    'expenses' => [
        'cols' => 'date:s time:s category:s note:t method:s channel:s amount:m status:s',
        'req' => ['category', 'amount'], 'search' => ['category', 'note'], 'read' => $admin, 'write' => $admin,
        'ref' => ['EXP-', 3], 'seed' => ['admin', 'EXPENSES'],
    ],
    'honors' => [
        'cols' => 'name:s program:s level:s sessions:i total:m paid:m',
        'req' => ['name'], 'search' => ['name', 'program', 'level'], 'read' => $admin, 'write' => $admin,
        'ref' => ['T-', 3], 'seed' => ['admin', 'HONORS'],
    ],
    'admin-notifications' => [
        'cols' => 'category:s title:s desc:t time:s action:s to:s tone:s unread:b',
        'req' => ['title'], 'search' => ['title'], 'read' => $admin, 'write' => $admin,
        'ref' => ['N', 0], 'seed' => ['admin', 'NOTIFICATIONS'],
    ],
    'inventory-items' => [
        'cols' => 'item_code:s name:s category:s quantity:i unit:s location:s condition:s purchase_date:s price_per_unit:m total_value:m status:s notes:t',
        'req' => ['name'], 'search' => ['name', 'item_code'], 'read' => $admin, 'write' => $admin,
        'ref' => ['INV-', 3], 'seed' => ['store', 'initialInventoryItems'],
    ],
    'whatsapp-logs' => [
        'cols' => 'recipient_name:s recipient_phone:s student_name:s student_grade:s category:s message:t sent_at:s status:s',
        'req' => ['recipient_name', 'message'], 'search' => ['recipient_name', 'student_name'], 'read' => $admin, 'write' => $admin,
        'ref' => ['WA-', 4], 'seed' => ['store', 'initialWhatsAppLogs'],
    ],

    // ---------------------------------------------------------------- Shared academic
    'classrooms' => [
        'cols' => 'name:s wali:s students:i student_count:i schedule:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $staff, 'write' => $staff,
        'ref' => ['', 0], 'seed' => ['store', 'initialClasses'],
    ],
    'grades' => [
        'cols' => 'student_id:s student_name:s student_nis:s class:s subject:s tugas:d uts:d uas:d final_score:d letter_grade:s',
        'req' => ['student_name'], 'search' => ['student_name'], 'read' => $staff, 'write' => $staff,
        'ref' => ['GR-', 3], 'seed' => ['store', 'initialGrades'],
    ],
    'courses' => [
        'cols' => 'title:s category:s status:s instructor:s students:i rating:d lessons:i description:t video_url:s images:j documents:j subject_id:s level:s last_studied:s',
        'req' => ['title'], 'search' => ['title', 'category'], 'read' => $staff, 'write' => $staff,
        'ref' => ['C-', 3], 'seed' => ['store', 'initialCourses'],
    ],
    'lesson-items' => [
        'cols' => 'course_id:s title:s module_title:s type:s duration:s completed:b video_url:s images:j documents:j summary:t content:t',
        'req' => ['title'], 'search' => ['title'], 'read' => $all, 'write' => $staff,
        'ref' => ['L', 0], 'seed' => ['store', 'initialLessons'],
    ],
    'assignments' => [
        'cols' => 'title:s type:s kelas:s subject:s deadline:s description:t submitted:i total:i status:s duration:i source:s mode:s questions:j accept:s',
        'req' => ['title'], 'search' => ['title', 'subject'], 'read' => $all, 'write' => $staff,
        'ref' => ['', 0], 'seed' => ['store', 'initialAssignments'],
    ],
    'submissions' => [
        'cols' => 'assignment_id:s student_id:s student_name:s student_nis:s submitted_at:s status:s score:d? feedback:t file_name:s answers:j',
        'req' => ['assignment_id'], 'search' => ['student_name'], 'read' => $all, 'write' => $all,
        'owner' => 'student', 'ownerColumn' => 'student_id', 'ref' => ['SUB-', 0], 'seed' => ['store', 'initialSubmissions'],
    ],
    'certificates' => [
        'cols' => 'title:s date:s issuer:s recipient_name:s credential_id:s grade_score:s student_ref:s',
        'req' => ['title'], 'search' => ['title'], 'read' => $all, 'write' => $staff,
        'owner' => 'student', 'ref' => ['CERT-', 3], 'seed' => ['store', 'initialCertificates'],
    ],
    'announcements' => [
        'cols' => 'title:s body:t date:s author:s category:s important:b unread:b tone:s',
        'req' => ['title'], 'search' => ['title', 'body'], 'read' => $all, 'write' => $staff,
        'ref' => ['P', 0], 'seed' => ['guru', 'ANNOUNCEMENTS'],
    ],
    'live-classes' => [
        'cols' => 'subject_id:s topic:s day_name:s date:s date_short:s start:s end:s room:s status:s meet_url:s opened_by_tutor:b',
        'req' => ['topic'], 'search' => ['topic'], 'read' => $all, 'write' => $staff,
        'ref' => ['LC', 0], 'seed' => ['siswa', 'LIVE_CLASSES'],
    ],
    'student-subjects' => [
        'cols' => 'student_ref:s subject_id:s name:s short:s color:s soft:s tutor:s tutor_avatar:s days:s time:s progress:i score:i trend:i predikat:s status:s class_name:s description:t',
        'req' => ['name'], 'search' => ['name'], 'read' => $all, 'write' => $staff,
        'owner' => 'student', 'ref' => ['SS-', 4],
    ],
    'student-attendances' => [
        'cols' => 'student_ref:s day:s date:s month:s subject_id:s time:s topic:s status:s note:s',
        'req' => ['status'], 'search' => ['topic'], 'read' => $all, 'write' => $staff,
        'owner' => 'student', 'ref' => ['A', 0],
    ],

    // ---------------------------------------------------------------- Tutor (owner scoped)
    'tutor-classes' => [
        'cols' => 'name:s code:s subject:s days:s time:s students:i status:s tone:s',
        'req' => ['name'], 'search' => ['name', 'code'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['', 0], 'seed' => ['guru', 'CLASSES'],
    ],
    'teach-sessions' => [
        'cols' => 'day:i slot:i subject:s kelas:s room:s mark:s',
        'req' => ['subject', 'kelas'], 'search' => ['kelas'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['S', 0], 'seed' => ['guru', 'TEACH_SESSIONS'],
    ],
    'materials' => [
        'cols' => 'kelas:s subject:s students:i status:s last:s date:s progress:i done:i planned:i color:s',
        'req' => ['kelas'], 'search' => ['kelas', 'last', 'subject'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['M', 0], 'seed' => ['guru', 'MATERIALS'],
    ],
    'modules' => [
        'cols' => 'title:s kelas:s topics:i updated:s status:s',
        'req' => ['title'], 'search' => ['title'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['MD', 0], 'seed' => ['guru', 'MODULES'],
    ],
    'class-students' => [
        'cols' => 'name:s kelas:s subject:s attendance:i score:d progress:i',
        'req' => ['name'], 'search' => ['name', 'kelas'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['2024', 3], 'seed' => ['guru', 'MY_STUDENTS'],
    ],
    'presences' => [
        'cols' => 'name:s status:s note:s time:s session:s',
        'req' => ['name', 'status'], 'search' => ['name'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['2024', 3], 'seed' => ['guru', 'PRESENCE'],
    ],
    'attention-cases' => [
        'cols' => 'name:s kelas:s subject:s issue:s issue_sub:s stats:j risk:s trend:i note:s',
        'req' => ['name'], 'search' => ['name'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['2024', 3], 'seed' => ['guru', 'ATTENTION'],
    ],
    'questions' => [
        'cols' => 'text:t type:s subject:s topic:s grade:s level:s mine:b fav:b',
        'req' => ['text'], 'search' => ['text', 'topic'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['Q', 0], 'seed' => ['guru', 'QUESTIONS'],
    ],
    'ai-results' => [
        'cols' => 'title:s subject:s grade:s type:s created:s date:s fav:b body:t',
        'req' => ['title'], 'search' => ['title'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['A', 0], 'seed' => ['guru', 'AI_RESULTS'],
    ],
    'change-requests' => [
        'cols' => 'kelas:s type:s detail:t status:s requested_by:s',
        'req' => ['detail'], 'search' => ['kelas', 'detail'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['REQ-', 4],
    ],
    'teaching-notes' => [
        'cols' => 'kelas:s date:s topic:s homework:s note:t',
        'req' => ['topic'], 'search' => ['topic', 'kelas'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['TN-', 4],
    ],
    'conversations' => [
        'cols' => 'name:s role:s time:s preview:s unread:i starred:b avatar:s messages:j',
        'req' => ['name'], 'search' => ['name', 'preview'], 'read' => $staff, 'write' => $staff,
        'owner' => 'tutor', 'ref' => ['C', 0], 'seed' => ['guru', 'CONVERSATIONS'],
    ],
];
