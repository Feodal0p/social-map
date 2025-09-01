<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function register(UserRegisterRequest $request) : JsonResponse 
    {
        $data = $request->validated();
        $data['role'] = User::ROLE_PARTICIPANT;
        $user = User::create($data);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login() {
        return 'login';
    }

    public function logout() {
        return 'logout';
    }
}
