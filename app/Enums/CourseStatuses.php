<?php

namespace App\Enums;

enum CourseStatuses {
    case PENDING;
    case APPROVED;
    case REJECTED;

    public function getId(): int {
        return match ($this) {
            self::PENDING => 0,
            self::APPROVED => 1,
            self::REJECTED => 2,
        };
    }

    public static function getTitle(int $id): string {
        return match ($id) {
            0 => "Pending",
            1 => "Approved",
            2 => "Rejected",
        };
    }
}
