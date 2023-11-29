<?php

namespace App\Jobs\Notifications;

use App\Enums\CourseStatuses;
use App\Enums\NotificationTypes;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CourseStatusChanged implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $data;
    /**
     * Create a new job instance.
     */
    public function __construct($data) {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        // Create new notification record 
        // then sending this notification via sockets with observer class 'NotificationObserver'
        Notification::create([
            'user_id' => $this->data['user_id'],
            'type_id' =>  $this->data['status'] == 1 ? NotificationTypes::NEW_COURSE_APPROVED : NotificationTypes::NEW_COURSE_REJECTED,
            'object_id' => $this->data['course_id'],
            'localized' => false,
            'subject' => "Your course has been " . CourseStatuses::getTitle($this->data['status']),
            'body' => "{$this->data['course_name']} has been " . CourseStatuses::getTitle($this->data['status'])
        ]);
    }
}
