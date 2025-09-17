<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Event;

class EventPolicy
{
    public function create(User $user): bool
    {
        return $user->roles()->whereIn('name', [User::ROLE_ADMIN, User::ROLE_ORGANIZER])->exists();
    }

    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }

    public function join(User $user, Event $event): bool
    {
        if ($user->id === $event->user_id) {
            return false;
        }

        if ($event->participants()->where('user_id', $user->id)->exists()) {
            return false;
        }

        if ($event->status === 'canceled' || $event->status === 'finished') {
            return false;
        }

        return true;
    }
}
