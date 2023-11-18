<?php

namespace App\Providers;

use App\Models\Notification;
use App\Observers\NotificationObserver;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use modules\Courses\Entities\Lecture;
use modules\Courses\Observers\LectureObserver;

class EventServiceProvider extends ServiceProvider {
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [];

    /**
     * Register any events for your application.
     */
    public function boot(): void {
        Lecture::observe(LectureObserver::class);
        Notification::observe(NotificationObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool {
        return false;
    }
}
