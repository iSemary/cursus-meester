<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialiteUser extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'social_id', 'social_type_id', 'social_avatar', 'social_token'];

    public static function registerUser($userId, $socialId, $socialTypeId, $socialAvatar, $socialToken) {
        self::create([
            'user_id' => $userId,
            'social_id' => $socialId,
            'social_type_id' => $socialTypeId,
            'social_avatar' => $socialAvatar,
            'social_token' => $socialToken
        ]);
    }
}
