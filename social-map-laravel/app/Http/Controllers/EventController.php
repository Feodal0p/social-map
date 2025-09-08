<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\EventResource;

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        $data = $request->validated();
        /** @var \App\Models\User */
        $user = auth('sanctum')->user();
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
    public function update(UpdateEventRequest $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event): JsonResponse
    {
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }
}
