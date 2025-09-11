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
            'creator' => new UserResource($this->whenLoaded('creator')),
            'created_at' => $this->created_at,
            'can_edit' => $request->user() ? $request->user()->can('update', $this->resource) : false,
        ];
    }
}
