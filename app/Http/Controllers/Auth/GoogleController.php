<?php

namespace App\Http\Controllers\Auth;

use App\Enums\SocialTypes;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\AuthController;
use App\Models\Auth\SocialiteUser;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends ApiController {
    /**
     * The function redirects the user to the Google login page using the Socialite package.
     * 
     * @return The `redirect()` method of the `Socialite` class is being called and the result of that
     * method is being returned.
     */
    public function redirect() {
        return Socialite::driver('google')->redirect();
    }

    /**
     * The function is a callback that handles the registration and login process for a user using Google
     * authentication.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function callback(): JsonResponse {
        $socialUser = Socialite::driver('google')->user();
        if ($socialUser->id) {
            // Check if this user exists
            $user = User::findBySocialOrEmail($socialUser, SocialTypes::GOOGLE->getId());
            $formattedUser = [];
            if (!$user) {
                // Create a new user
                $user = User::create([
                    'full_name' => $socialUser->name,
                    'email' => $socialUser->email,
                    'password' => md5($socialUser->token),
                    'email_verified_at' => Carbon::now()
                ]);
                // Create a new socialite user
                SocialiteUser::registerUser($user->id, $socialUser->id, SocialTypes::GOOGLE->getId(), $socialUser->avatar, $socialUser->token);
            }

            // Prepare formatted user
            $formattedUser = (new AuthController)->collectUserDetails($user);

            return $this->return(200, 'User registered successfully', ['user', $formattedUser]);
        }

        Log::Info($socialUser);
        return $this->return(400, 'Something went wrong!', []);
    }
}
