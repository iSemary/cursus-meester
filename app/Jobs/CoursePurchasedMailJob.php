<?php

namespace App\Jobs;

use App\Mail\CoursePurchasedMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class CoursePurchasedMailJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user;
    private $data;
    /**
     * Create a new job instance.
     */
    public function __construct($user, $data) {
        $this->user = $user;
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        $data = [
            'name' => $this->user->full_name,
            'email' => $this->user->email,
        ];

        if (env("APP_ENV") == "production")
            Mail::to($this->user['email'])->send(new CoursePurchasedMail($data));
    }
}
