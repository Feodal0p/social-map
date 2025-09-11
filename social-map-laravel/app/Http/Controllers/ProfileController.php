<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Profile $profile): JsonResponse
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

    public function update(ProfileUpdateRequest $request, Profile $profile): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');

            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }

        } else {
            unset($data['avatar']);
        }
        
        $profile->update($data);

        return response()->json([
            'request' => $request->all(),
            'file' => $request->hasFile('avatar'),
            'data' => $data,
        ]);
    }
}
