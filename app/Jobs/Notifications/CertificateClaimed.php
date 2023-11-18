<?php

namespace App\Jobs\Notifications;

use App\Enums\NotificationTypes;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CertificateClaimed implements ShouldQueue {
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
            'type_id' => NotificationTypes::NEW_CERTIFICATE_CLAIMED,
            'localized' => false,
            'subject' => 'New Claimed Certificate!',
            'body' => "Congratulations! You have successfully claimed a new certificate on {$this->data['course_name']}",
        ]);
    }
}
