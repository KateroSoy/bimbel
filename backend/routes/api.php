<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseContentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StudentPortalController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:10,1');
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me', [AuthController::class, 'updateProfile']);
    Route::put('me/password', [AuthController::class, 'updatePassword']);

    Route::get('settings', [SettingsController::class, 'show']);
    Route::put('settings', [SettingsController::class, 'update'])->middleware('role:admin');

    Route::get('admin/dashboard', [DashboardController::class, 'admin'])->middleware('role:admin');

    Route::prefix('student')->middleware('role:siswa')->group(function () {
        Route::get('portal', [StudentPortalController::class, 'portal']);
        Route::post('lessons/{lesson}/complete', [StudentPortalController::class, 'completeLesson']);
        Route::delete('lessons/{lesson}/complete', [StudentPortalController::class, 'uncompleteLesson']);
        Route::post('bills/{bill}/pay', [StudentPortalController::class, 'payBill']);
    });

    Route::middleware('role:admin,guru')->group(function () {
        Route::get('courses/{course}/modules', [CourseContentController::class, 'modules']);
        Route::post('courses/{course}/modules', [CourseContentController::class, 'storeModule']);
        Route::put('modules/{module}', [CourseContentController::class, 'updateModule']);
        Route::delete('modules/{module}', [CourseContentController::class, 'destroyModule']);
        Route::post('modules/{module}/lessons', [CourseContentController::class, 'storeLesson']);
        Route::put('lessons/{lesson}', [CourseContentController::class, 'updateLesson']);
        Route::delete('lessons/{lesson}', [CourseContentController::class, 'destroyLesson']);
        Route::get('courses/{course}/enrollments', [CourseContentController::class, 'enrollments']);
    });
    Route::middleware('role:admin')->group(function () {
        Route::post('courses/{course}/enrollments', [CourseContentController::class, 'enroll']);
        Route::delete('courses/{course}/enrollments', [CourseContentController::class, 'unenroll']);
    });

    Route::get('r/{resource}', [ResourceController::class, 'index']);
    Route::post('r/{resource}', [ResourceController::class, 'store']);
    Route::put('r/{resource}/{id}', [ResourceController::class, 'update']);
    Route::delete('r/{resource}/{id}', [ResourceController::class, 'destroy']);
});
