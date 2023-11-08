<?php

namespace App\Services\Formatter;

class Slug {
    public static function returnFormatted(string $slug): string {
        $formattedSlug = $slug;
        $formattedSlug = str_replace([' ', '_', '.'], '-', $formattedSlug);
        $formattedSlug = preg_replace('/[^a-z0-9-]/', '', $formattedSlug);
        $formattedSlug = strtolower($formattedSlug);
        $formattedSlug = trim($formattedSlug, '-_');
        return $formattedSlug;
    }
}
