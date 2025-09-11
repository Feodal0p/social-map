<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Event;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'organizer']);
        Role::firstOrCreate(['name' => 'participant']);

        $user1 = User::firstOrCreate(
            ['email' => '1@1'],
            ['name' => 'Test User Organizer || Admin', 'password' => bcrypt('12345678')]
        );
        $user1->roles()->sync([Role::where('name', User::ROLE_ADMIN)->first()->id, Role::where('name', User::ROLE_ORGANIZER)->first()->id]);
        $user1->profile()->create([
            'avatar' => '/storage/images/user-default.png',
        ]);

        $user2 = User::firstOrCreate(
            ['email' => '2@2'],
            ['name' => 'Test User Participant', 'password' => bcrypt('12345678')]
        );
        $user2->roles()->sync([Role::where('name', User::ROLE_PARTICIPANT)->first()->id]);
        $user2->profile()->create([
            'avatar' => '/storage/images/user-default.png',
        ]);

        Event::firstOrCreate(
            ['title' => 'Test Event'],
            [
                'description' => 'This is the test event description.',
                'start_time' => now()->addDays(5),
                'end_time' => now()->addDays(10)->addHours(2),
                'location' => 'вулиця Test 1488, Луцьк, Волинська область, Україна',
                'latitude' => 50.747231,
                'longitude' => 25.3196239,
                'status' => Event::STATUS_UPCOMING,
                'user_id' => $user1->id,
            ]
        );
    }
}
