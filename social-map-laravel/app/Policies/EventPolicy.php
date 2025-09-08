<?php

namespace App\Policies;

use App\Models\User;

class EventPolicy
{
    public function create(User $user): bool
    {
        return $user->roles()->whereIn('name', [User::ROLE_ADMIN, User::ROLE_ORGANIZER])->exists();
    }
}
