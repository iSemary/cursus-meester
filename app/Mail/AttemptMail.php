<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AttemptMail extends Mailable {
    use Queueable, SerializesModels;
    private $data;

    /**
     * Create a new message instance.
     */
    public function __construct($data) {
        $this->data = $data;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope {
        return new Envelope(
            subject: 'Login Attempt Failed',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content {
        return new Content(
            view: 'mails.attempt',
            with: ['body' => $this->data]
        );
    }
}
