<?php

namespace App\Enums;

enum SocialTypes {
    case GOOGLE;
    case FACEBOOK;
    case TWITTER;
    case LINKEDIN;

    public function getId(): int {
        return match ($this) {
            self::GOOGLE => 1,
            self::FACEBOOK => 2,
            self::TWITTER => 3,
            self::LINKEDIN => 4,
        };
    }
}
