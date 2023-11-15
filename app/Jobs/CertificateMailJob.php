<?php

namespace App\Jobs;

use App\Mail\CertificateMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class CertificateMailJob implements ShouldQueue {
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
        $data = [
            'certificate_url' => $this->data->certificate_url,
        ];
        Mail::to($this->data['email'])->send(new CertificateMail($data));
    }
}
