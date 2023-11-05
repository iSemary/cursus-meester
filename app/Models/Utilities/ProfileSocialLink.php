<?php

namespace App\Models\Utilities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ProfileSocialLink extends Model {
    use HasFactory, SoftDeletes, LogsActivity;
    protected $fillable = ['user_id', 'link_type', 'link_url'];


    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }

    public static function syncLinks(int $userId, array $socialLinks) {
        //  Soft delete any existing social links
        self::where('user_id', $userId)->delete();
        // insert the new social links
        foreach ($socialLinks as $linkType => $linkUrl) {
            self::withTrashed()->updateOrCreate(
                [
                    'user_id' => $userId,
                    'link_type' => $linkType,
                ],
                [
                    'user_id' => $userId,
                    'link_type' => $linkType,
                    'link_url' => $linkUrl,
                ]
            )->restore();
        }
    }
}
