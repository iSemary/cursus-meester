<?php

namespace App\Jobs;

use App\Services\SMS\Driver as SMSDriver;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOTP implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $phoneNumber;
    private $otp;
    /**
     * Create a new job instance.
     */
    public function __construct($phoneNumber, $otp) {
        $this->phoneNumber = $phoneNumber;
        $this->otp = $otp;
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        (new SMSDriver)->send($this->phoneNumber, $this->otp);
    }
}
