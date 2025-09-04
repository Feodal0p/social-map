<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;

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

Route::apiResource('events', EventController::class);
