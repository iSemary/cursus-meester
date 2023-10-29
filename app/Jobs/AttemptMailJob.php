<?php

namespace App\Jobs;

use App\Mail\AttemptMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class AttemptMailJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    private $user;
    private $details;
    /**
     * Create a new job instance.
     */
    public function __construct($user, $details) {
        $this->user = $user;
        $this->details = $details;
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        $data = [
            'name' => $this->user->full_name,
            'email' => $this->user->email,
            'ip' => $this->details->ip,
            'agent' => $this->details->agent,
            'created_at' => $this->details->created_at,
        ];
        Mail::to($this->user['email'])->send(new AttemptMail($data));
    }
}
