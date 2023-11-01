<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailToken extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'token', 'status', 'expired_at'];
    /**
     * The function creates a token for a user, stores it in the database, and returns the token.
     * 
     * @param int userId The `userId` parameter is an integer that represents the ID of the user for whom
     * the token is being created.
     * 
     * @return string the generated token.
     */
    public static function createToken(int $userId): string {
        $token = self::generateToken();
        self::create([
            'user_id' => $userId,
            'token' => $token,
            'status' => 0,
            'expired_at' => now()->addMonth()
        ]);

        return $token;
    }

    /**
     * The function generates a random token consisting of 64 hexadecimal characters.
     * 
     * @return string a randomly generated token as a hexadecimal string.
     */
    public static function generateToken(): string {
        return  bin2hex(random_bytes(64));
    }
}
