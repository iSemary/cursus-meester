<?php

namespace App\Enums;

enum NotificationTypes: int {
    const NEW_CERTIFICATE_CLAIMED = 1;
    const NEW_RATE = 2;
    const NEW_COURSE_APPROVED = 3;
    const NEW_COURSE_REJECTED = 4;
    const COURSE_PURCHASED = 4;
    const CART_PURCHASED = 4;
}
