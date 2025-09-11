<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\EventResource;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => EventResource::collection(Event::with('creator')->get()),
        ]);
    }

    public function latest(): JsonResponse
    {
        return response()->json([
            'data' => EventResource::collection(Event::with('creator')->latest()->take(4)->get()),
        ]);
    }

    public function cancel(Event $event): JsonResponse
    {
        $event->status = Event::STATUS_CANCELED;
        $event->save();

        return response()->json([
            'data' => new EventResource($event->load('creator')),
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        $data = $request->validated();
        /** @var \App\Models\User */
        $user = auth('sanctum')->user();

        if ($request->hasFile('preview_image')) {
            $data['preview_image'] = $request->file('preview_image')->store('preview_images', 'public');
        } else {
            $data['preview_image'] = '/images/no-preview.jpeg';
        }

        $event = $user->events()->create($data);

        return response()->json([
            'data' => new EventResource($event->load('creator')),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('preview_image')) {
            $data['preview_image'] = $request->file('preview_image')->store('preview_images', 'public');

            if ($event->preview_image && $event->preview_image !== '/images/no-preview.jpeg') {
                Storage::disk('public')->delete($event->preview_image);
            }
        } else {
            unset($data['preview_image']);
        }

        $event->update($data);

        return response()->json([
            'data' => new EventResource($event->load('creator')),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event): JsonResponse
    {
        if ($event->preview_image !== '/images/no-preview.jpeg') {
            Storage::disk('public')->delete($event->preview_image);
        }
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }
}
