<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    public function index($type, $id) : JsonResponse
    {

        $model = $this->resolveModel($type, $id);
        $comments = $model->comments->reverse();

        return response()->json([
            'comments' => CommentResource::collection($comments->load('user')),
        ], 200);
    }

    public function store($type, $id, Request $request) : JsonResponse
    {
        $model = $this->resolveModel($type, $id);
        $user = $request->user();

        if ($type === 'event' && !$model->participants()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Only participants can comment on this event.'], 403);
        }

        $data = $request->validate([
            'message' => 'required|string|max:1000',
        ]);
        $data['user_id'] = $user->id;

        $comment = $model->comments()->create($data);

        return response()->json([
            'comment' => new CommentResource($comment->load('user')),
        ], 201);
    }

    private function resolveModel($type, $id)
{
    return match($type) {
        'event' => Event::findOrFail($id),
        'profile' => Profile::findOrFail($id),
        default => abort(404, 'Unknown type'),
    };
}
}
