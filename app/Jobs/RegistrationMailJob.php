<?php

namespace App\Jobs;

use App\Mail\RegistrationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class RegistrationMailJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user;
    private $token;
    /**
     * Create a new job instance.
     */
    public function __construct($user, $token) {
        $this->user = $user;
        $this->token = $token;
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        $data = [
            'name' => $this->user->full_name,
            'email' => $this->user->email,
            'token' => $this->token,
        ];

        if (env("APP_ENV") == "production")
            Mail::to($this->user['email'])->send(new RegistrationMail($data));
    }
}
