<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            'preview_image' => $this->preview_image ? asset('storage/' . $this->preview_image) : null,
            'title' => $this->title,
            'location' => $this->location,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'description' => $this->description,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'participants_count' => $this->participants()->count(),
            'created_at' => $this->created_at,
            'permissions' => [
                'can_edit' => $request->user() && $request->user()->can('update', $this->resource),
                'check_creator' => $request->user() && $request->user()->id === $this->user_id,
                'can_join' => $request->user() && $request->user()->can('join', $this->resource),
            ],
        ];
    }
}
