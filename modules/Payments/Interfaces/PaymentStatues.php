<?php

namespace modules\Payments\Interfaces;

interface PaymentStatues {
    const PENDING = 0;
    const SUCCESS = 1;
    const FAILED = 2;
    const EXPIRED = 3;
}
