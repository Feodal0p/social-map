<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\EventResource;
use App\Http\Resources\EventSmallResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        if (request()->filled('coords')) {
            [$lat, $lng] = explode(',', request('coords'));
            $events = Event::with('categories')
                ->selectRaw(
                    'events.*, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance',
                    [$lat, $lng, $lat]
                )->get();
        } else {
            $events = Event::with('categories')->get();
        }

        if (request()->filled('status') && request('status') !== 'all') {
            $statuses = explode(',', request('status'));
            $events = $events->filter(function ($event) use ($statuses) {
                return in_array($event->status, $statuses);
            });
        }

        if (request()->filled('categories') && request('categories') !== 'all') {
            $categories = explode(',', request('categories'));
            $events = $events->filter(function ($event) use ($categories) {
                return array_intersect($event->categories->pluck('name')->toArray(), $categories);
            });
        }

        if (request()->filled('radius') && request('radius') !== 'all' && request()->filled('coords')) {
            $radius = (int) request('radius');
            $events = $events->filter(function ($event) use ($radius) {
                return $event->distance <= $radius;
            });
        }

        if (
            request()->filled('date_from') && request()->filled('date_to')
            && request('date_from') !== 'all' && request('date_to') !== 'all'
        ) {
            $date_from = request('date_from');
            $date_to = request('date_to');
            $events = $events->filter(function ($event) use ($date_from, $date_to) {
                return Carbon::parse($event->start_time)->toDateString() <= $date_to
                    && Carbon::parse($event->end_time)->toDateString() >= $date_from;
            });
        } elseif (request()->filled('date_from') && request('date_from') !== 'all') {
            $date_from = request('date_from');
            $events = $events->filter(function ($event) use ($date_from) {
                return Carbon::parse($event->end_time)->toDateString() >= $date_from;
            });
        } elseif (request()->filled('date_to') && request('date_to') !== 'all') {
            $date_to = request('date_to');
            $events = $events->filter(function ($event) use ($date_to) {
                return Carbon::parse($event->start_time)->toDateString() <= $date_to;
            });
        }

        return response()->json([
            'data' => EventSmallResource::collection($events),
        ]);
    }

    public function myEvents(): JsonResponse
    {
        /** @var \App\Models\User */
        $user = auth('sanctum')->user();
        $events = $user->eventsParticipated()->with(['creator', 'categories'])
        ->get()->filter(function ($event) {
            return !in_array($event->status, [Event::STATUS_FINISHED, Event::STATUS_CANCELED]);
        });

        return response()->json([
            'data' => EventResource::collection($events),
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
            'data' => new EventSmallResource($event),
        ], 200);
    }

    public function statuses(): JsonResponse
    {
        return response()->json([
            'statuses' => [
                Event::STATUS_ACTIVE,
                Event::STATUS_UPCOMING,
                Event::STATUS_FINISHED,
                Event::STATUS_CANCELED,
            ]
        ]);
    }

    public function join(Event $event): JsonResponse
    {

        if (in_array($event->status, [Event::STATUS_FINISHED, Event::STATUS_CANCELED])) {
            return response()->json(['message' => 'Неможливо приєднатися до завершеної або скасованої події.'], 403);
        }

        /** @var \App\Models\User */
        $user = auth('sanctum')->user();

        if ($user->can('join', $event)) {
            $event->participants()->attach($user->id);
        } else {
            $event->participants()->detach($user->id);
        }

        return response()->json([
            'can_join' => $user->can('join', $event),
            'participants_count' => $event->participants()->count(),
        ], 200);
    }

    public function participants(Event $event): JsonResponse
    {
        $creator = $event->creator;
        $participants = $event->participants()->where('user_id', '!=', $creator->id)->get();

        return response()->json([
            'participants' => UserResource::collection($participants->load('profile')),
            'creator' => new UserResource($creator->load('profile')),
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
        $event->categories()->attach($data['categories']);
        $event->participants()->attach($user->id);

        return response()->json([
            'data' => new EventSmallResource($event),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return response()->json([
            'data' => new EventResource($event->load(['creator', 'categories'])),
        ]);
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
        $event->categories()->sync($data['categories']);

        return response()->json([
            'data' => new EventSmallResource($event),
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
