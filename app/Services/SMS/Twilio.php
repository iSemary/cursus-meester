<?php

namespace App\Services\SMS;

class Twilio {
    private $twilioAccountSID;
    private $twilioAccountToken;
    private $twilioVerifyServiceSID;

    public function __construct() {
        $this->twilioAccountSID = env("TWILIO_ACCOUNT_SID");
        $this->twilioAccountToken = env("TWILIO_ACCOUNT_TOKEN");
        $this->twilioVerifyServiceSID = env("TWILIO_VERIFY_SERVICE_SID");
    }

    public function send(int $phoneNumber, string $message): bool {
        
    }
}
