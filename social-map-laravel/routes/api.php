<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;

Route::controller(AuthController::class)->group(function () {
    Route::get('/user', 'user')->middleware('auth:sanctum');
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
});

Route::controller(ProfileController::class)->group(function () {
    Route::get('profile/{profile}', 'show');
    Route::patch('profile/{profile}', 'update')->middleware(['auth:sanctum', 'can:update,profile']);
});

Route::controller(EventController::class)->group(function () {
    Route::get('events', 'index');
    Route::get('events/latest', 'latest');
    Route::get('events/{event}', 'show');
    Route::post('events', 'store')->middleware(['auth:sanctum', 'can:create,App\Models\Event']);
    Route::patch('events/{event}', 'update')->middleware(['auth:sanctum', 'can:update,event']);
    Route::delete('events/{event}', 'destroy')->middleware(['auth:sanctum', 'can:delete,event']);
    Route::post('events/{event}/cancel', 'cancel')->middleware(['auth:sanctum', 'can:update,event']);
});

Route::get('/categories', [CategoryController::class, 'index']);
