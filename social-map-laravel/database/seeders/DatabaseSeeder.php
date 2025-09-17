<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Event;
use App\Models\Category;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = [
            'admin',
            'organizer',
            'participant',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $categores = [
            'Волонтерство',
            'Освіта та навчання',
            'Екологія та довкілля',
            'Здоров’я та спорт',
            'Культура та мистецтво',
            'Технології та інновації',
            'Дитячі та сімейні події',
            'Соціальні ініціативи',
            'Бізнес та підприємництво',
            'Інші',
        ];
        foreach ($categores as $category) {
            Category::firstOrCreate(['name' => $category]);
        }

        $user1 = User::firstOrCreate(
            ['email' => '1@1'],
            ['name' => 'Test User Organizer || Admin', 'password' => bcrypt('12345678')]
        );
        $user1->roles()->sync([
            Role::where('name', User::ROLE_ADMIN)->first()->id,
            Role::where('name', User::ROLE_ORGANIZER)->first()->id
        ]);
        $user1->profile()->create([
            'avatar' => '/images/user-default.png',
        ]);

        $user2 = User::firstOrCreate(
            ['email' => '2@2'],
            ['name' => 'Test User Participant', 'password' => bcrypt('12345678')]
        );
        $user2->roles()->sync([Role::where('name', User::ROLE_PARTICIPANT)->first()->id]);
        $user2->profile()->create([
            'avatar' => '/images/user-default.png',
        ]);

        $event1 = Event::firstOrCreate(
            ['title' => 'Test Event #1'],
            [
                'preview_image' => '/images/no-preview.jpeg',
                'description' => 'This is the test event #1 description.',
                'start_time' => now()->addDays(5),
                'end_time' => now()->addDays(10)->addHours(2),
                'location' => 'вулиця Test 1488, Луцьк, Волинська область, Україна',
                'latitude' => 50.747231,
                'longitude' => 25.3196239,
                'status' => Event::STATUS_UPCOMING,
                'user_id' => $user1->id,
            ]
        );
        $event1->categories()->sync([1, 2]);
        $event1->participants()->sync([$user1->id, $user2->id]);

        $event2 = Event::firstOrCreate(
            ['title' => 'Test Event #2'],
            [
                'preview_image' => '/images/no-preview.jpeg',
                'description' => 'This is the test event #2 description.',
                'start_time' => now(),
                'end_time' => now()->addDays(10)->addHours(2),
                'location' => 'вулиця Test 1337, Луцьк, Волинська область, Україна',
                'latitude' => 50.717231,
                'longitude' => 25.3896239,
                'status' => Event::STATUS_UPCOMING,
                'user_id' => $user1->id,
            ]
        );
        $event2->categories()->sync([1, 6]);
        $event2->participants()->sync([$user1->id, $user2->id]);

        $event3 = Event::firstOrCreate(
            ['title' => 'Test Event #3'],
            [
                'preview_image' => '/images/no-preview.jpeg',
                'description' => 'This is the test event #3 description.',
                'start_time' => now(),
                'end_time' => now(),
                'location' => 'вулиця Test 1337, Луцьк, Волинська область, Україна',
                'latitude' => 50.757231,
                'longitude' => 25.3496239,
                'status' => Event::STATUS_UPCOMING,
                'user_id' => $user1->id,
            ]
        );
        $event3->categories()->sync(9);
        $event3->participants()->sync([$user1->id, $user2->id]);
    }
}
