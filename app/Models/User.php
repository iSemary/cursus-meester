<?php

namespace App\Models;

use App\Models\Auth\EmailToken;
use App\Models\Auth\UserOTP;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['full_name', 'email', 'username', 'phone', 'country_id', 'language_id', 'password'];

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
        $userToken = EmailToken::where("token", $token)->where("status", 0)->first();
        if ($userToken) {
            $userToken->update(["status" => 1]);
            return User::where("id", $userToken->user_id);
        } else {
            return false;
        }
    }

    /**
     * The function creates a password reset token for a user if one does not already exist.
     * 
     * @return string password reset token.
     */
    public function createResetToken(): string {
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
        $this->update(['password' => bcrypt($newPassword)]);
    }

    /**
     * The function "verifyPhoneNumber" deletes any existing user OTPs and updates the "phone_verified_at"
     * field of the user with the given ID to the current time.
     * 
     * @param int userId The userId parameter is an integer that represents the ID of the user whose phone
     * number needs to be verified.
     */
    public static function verifyPhoneNumber(int $userId): void {
        UserOTP::where("user_id", $userId)->delete();
        User::where('id', $userId)->update(['phone_verified_at' => now()]);
    }

    /**
     * The function finds a user by their social ID and social type ID, or by their email.
     * 
     * @param socialUser The socialUser parameter is an object that represents a user from a social media
     * platform. It likely contains information such as the user's ID, email, and other relevant details.
     * @param socialId The socialId parameter is the identifier for the type of social media platform the
     * user is using. It is used to filter the search for users based on the social media platform they are
     * registered with.
     * 
     */
    public static function findBySocialOrEmail($socialUser, $socialId) {
        return self::where("users.email", $socialUser->email)->first();
    }

    /**
     * The function sets the email attribute and updates the email_verified_at attribute based on whether
     * the email value has changed.
     * 
     * @param value The value parameter represents the new value that is being assigned to the email
     * attribute.
     */
    public function setEmailAttribute($value) {
        $this->attributes['email'] = $value;
        $this->attributes['email_verified_at'] = $this->email == $value ? $this->email_verified_at : null;
    }

    /**
     * The function sets the phone attribute and updates the phone_verified_at attribute if the phone value
     * has changed.
     * 
     * @param value The value parameter represents the new value that is being set for the phone attribute.
     */
    public function setPhoneAttribute($value) {
        $this->attributes['phone'] = $value;
        $this->attributes['phone_verified_at'] = $this->phone == $value ? $this->phone_verified_at : null;
    }


    public function rate() {
        $this->hasMany(User::class, 'user_id');
    }
}
