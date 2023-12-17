<?php

namespace modules\Payments\Interfaces;


interface PaymentMethods {
    const STRIPE = 1;
    const PAYPAL = 2;

    const METHODS_TEXT = [
        "",
        PaymentMethods::STRIPE => 'Credit Card',
        PaymentMethods::PAYPAL => 'Paypal',
    ];
}
