<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRegisterRequest;
use App\Http\Requests\UserLoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function user(Request $request): UserResource
    {
        return new UserResource($request->user()->load('profile'));
    }

    public function register(UserRegisterRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = User::create($data);
        $participantRole = Role::where('name', User::ROLE_PARTICIPANT)->first();
        if ($participantRole) {
            $user->roles()->attach($participantRole->id);
        }

        $user->profile()->create([
            'avatar' => '/storage/images/user-default.png',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(UserLoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'errors' => [
                    'email' => ['The provided credentials are incorrect.'],
                    'password' => ['The provided credentials are incorrect.']
                ],
            ], 401);
        }

        /** @var \App\Models\User */
        $user = auth('sanctum')->user();
        $request->session()->regenerate();

        return response()->json([
            'user' => new UserResource($user),
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => "You are logged out"
        ], 200);
    }
}
