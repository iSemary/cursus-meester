<?php

namespace modules\Payments\Interfaces;

interface PaymentStatues {
    const PENDING = 0;
    const SUCCESS = 1;
    const FAILED = 2;
    const EXPIRED = 3;
    const CANCELED = 4;

    const STATUES_TEXT = [
        PaymentStatues::PENDING => 'Pending',
        PaymentStatues::SUCCESS => 'Success',
        PaymentStatues::FAILED => 'Failed',
        PaymentStatues::EXPIRED => 'Expired',
        PaymentStatues::CANCELED => 'Canceled',
    ];
}
