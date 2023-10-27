<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['full_name', 'email', 'phone', 'country_id', 'password'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    /**
     * The function `verifyToken` checks if a given token exists in the `EmailToken` table, updates its
     * status to 1, and returns the corresponding user from the `User` table.
     * 
     * @param string token The "token" parameter is a string that represents a unique identifier for a user's
     * email verification token.
     * 
     * @return User an instance of the User model where the id matches the user_id of the EmailToken.
     */
    public static function verifyToken(string $token) {
        $userToken = EmailToken::where("token", $token)->firstOrFail();
        EmailToken::where('token', $userToken)->update(["status" => 1]);
        return User::where("id", $userToken->user_id);
    }


    /**
     * The function creates a password reset token for a user if one does not already exist.
     * 
     * @return the password reset token.
     */
    public function createResetToken() {
        $token = DB::table('password_reset_tokens')->where("user_id", $this->id)->value('token');
        if (!$token) {
            $token = EmailToken::generateToken();
            DB::table('password_reset_tokens')->insert(['user_id' => $this->id, 'token' => $token]);
        }
        return $token;
    }

    /**
     * The function updates the password of the current user with a new password.
     * 
     * @param string newPassword The  parameter is a string that represents the new password
     * that the user wants to set.
     */
    public function updatePassword(string $newPassword): void {
        $this->update(['password', bcrypt($newPassword)]);
    }

    public static function verifyPhoneNumber(int $userId): void {
        UserOTP::where("user_id", $userId)->delete();
        User::where('id', $userId)->update(['phone_verified_at' => now()]);
    }
}
