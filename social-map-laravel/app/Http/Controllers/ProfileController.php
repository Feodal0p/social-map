<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function show(Profile $profile) : JsonResponse
    {
        /** @var \App\Models\User */
        $user = auth('sanctum')->user();
        return response()->json([
            'data' => new ProfileResource($profile->load('user')),
            'permissions' => [
                'can_edit' => $user ? $user->can('update', $profile) : false
            ]
        ]);
    }

    public function update()
    {

    }

}
