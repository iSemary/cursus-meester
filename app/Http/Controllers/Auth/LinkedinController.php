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

class LinkedinController extends ApiController {
    public function redirect() {
        return Socialite::driver('linkedin-openid')->redirect();
    }
    public function callback(): JsonResponse {
        $socialUser = Socialite::driver('linkedin-openid')->user();
        if ($socialUser->id) {
            // Check if this user exists
            $user = User::findBySocialOrEmail($socialUser, SocialTypes::LINKEDIN->getId());
            $formattedUser = [];
            if (!$user) {
                // Create a new user
                $user = User::create([
                    'full_name' => $socialUser->name,
                    'email' => $socialUser->email,
                    'password' => md5($socialUser->token),
                ]);
                // Create a new socialite user
                SocialiteUser::registerUser($user->id, $socialUser->id, SocialTypes::LINKEDIN->getId(), $socialUser->avatar, $socialUser->token);
            }

            // Prepare formatted user
            $formattedUser = (new AuthController)->collectUserDetails($user);
            return $this->return(200, 'User registered successfully', ['user', $formattedUser]);
        }
        Log::Info(json_encode($socialUser));
        return $this->return(400, 'Something went wrong!', []);
    }
}
