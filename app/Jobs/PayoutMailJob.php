<?php

namespace App\Jobs;

use App\Mail\PayoutMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class PayoutMailJob implements ShouldQueue {
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
            'total_amount' => $this->data['total_amount'],
            'created_at' => $this->data['created_at'],
            'reference_number' => $this->data['reference_number'],
        ];

        // if (env("APP_ENV") == "production")
            Mail::to($this->user->email)->send(new PayoutMail($data));
    }
}
