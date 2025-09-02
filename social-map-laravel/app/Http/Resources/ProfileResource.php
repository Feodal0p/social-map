<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'avatar' => $this->avatar,
            'location' => $this->location,
            'phone' => $this->phone,
            'interests' => $this->interests,
            'event_count' => $this->events_count,
            'event_created' => $this->event_created,
            'rating' => $this->rating,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->whenLoaded('user'))
        ];
    }
}
