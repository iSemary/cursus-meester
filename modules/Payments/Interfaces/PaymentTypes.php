<?php

namespace modules\Payments\Interfaces;

interface PaymentTypes {
    const SINGLE_ITEM = 1;
    const CART = 2;

    const TYPES_TEXT = [
        "",
        PaymentTypes::SINGLE_ITEM => 'Single Item',
        PaymentTypes::CART => 'Cart',
    ];
}
