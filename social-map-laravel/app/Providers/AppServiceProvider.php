<?php

namespace App\Providers;

use App\Models\Profile;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Policies\ProfilePolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Profile::class, ProfilePolicy::class);
    }
}
