<?php

namespace App\Enums;

enum SocialLinks {
    case GITHUB;
    case STACKOVERFLOW;
    case FACEBOOK;
    case TWITTER;
    case LINKEDIN;
    case WEBSITE;

    public function getId(): int {
        return match ($this) {
            self::GITHUB => 1,
            self::STACKOVERFLOW => 2,
            self::FACEBOOK => 3,
            self::TWITTER => 4,
            self::LINKEDIN => 5,
            self::WEBSITE => 6,
        };
    }
}
