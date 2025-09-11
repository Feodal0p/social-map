<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->roles->pluck('name'),
            'profile_id' => $this->whenLoaded('profile', fn() => $this->profile->id),
            'profile_avatar' => $this->whenLoaded('profile', fn() => asset('storage/' . $this->profile->avatar)),
        ];
    }
}
