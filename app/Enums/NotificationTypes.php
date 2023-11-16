<?php

namespace App\Enums;

enum NotificationTypes: int {
    case NEW_CERTIFICATE_CLAIMED = 1;
    case NEW_RATE = 2;
    case NEW_COURSE_APPROVED = 3;
}
