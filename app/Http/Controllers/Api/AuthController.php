<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends ApiController {
    /**
     * The function registers a new user, creates a user record, fires an email confirmation queue,
     * collects user details, and returns a success JSON response.
     * 
     * @param RegisterUserRequest request The  parameter is an instance of the RegisterUserRequest
     * class. It contains the data that was sent in the HTTP request to register a new user. This data is
     * validated against the rules defined in the RegisterUserRequest class before being used to create a
     * new user record.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function register(RegisterUserRequest $request): JsonResponse {
        /* Requested data passed the validation */
        // Create new user record
        $user = User::create($request->validated());
        // TODO Fire Email Confirmation Queue

        // collect user details to return in the json response
        $response = $this->collectUserDetails($user);
        // Return Success Json Response
        return $this->return(200, 'User Registered Successfully', ['user' => $response]);
    }

    /**
     * The function attempts to log in a user by checking their login credentials and returns a JSON
     * response indicating whether the login was successful or not.
     * 
     * @param LoginUserRequest request The  parameter is an instance of the LoginUserRequest
     * class. It contains the data submitted by the user during the login process, such as the email
     * and password.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function login(LoginUserRequest $request): JsonResponse {
        // Check login credentials
        if (auth()->attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = auth()->user();
            // collect user details to return in the json response
            $response = $this->collectUserDetails($user);
            // Return Success Json Response
            return $this->return(200, 'User Logged in Successfully', ['user' => $response]);
        } else {
            return $this->return(400, 'Invalid credentials');
        }
    }

    /**
     * The function collects user details and adds an access token to the user object.
     * 
     * @param User user The parameter `` is an instance of the `User` class.
     * 
     * @return User the updated User object with the added access_token property.
     */
    public function collectUserDetails(User $user): User {
        // Invoke authentication token
        $user['access_token'] = $user->createToken('web-app')->accessToken;
        return $user;
    }

    /**
     * The function logs out a user by deleting their access tokens either for a specific request or
     * for all tokens associated with the user.
     * 
     * @param Request request The  parameter is an instance of the Request class, which
     * represents an HTTP request. It contains information about the request such as the request
     * method, headers, and input data. In this code, it is used to determine the type of logout action
     * to perform.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function logout(Request $request): JsonResponse {
        $user = auth()->guard('api')->user();
        try {
            if ($request->type == 1) {
                // Delete only the request token
                DB::table("oauth_access_tokens")->where("id", $user->token()['id'])->delete();
            } else {
                // Delete all user tokens
                $user->tokens->each(function ($token, $key) {
                    $token->delete();
                });
            }
            return $this->return(200, 'Logged out successfully');
        } catch (Exception $e) {
            return $this->return(400, 'Couldn\'t logout using this token', [], ['e' => $e]);
        }
    }

    public function verifyEmail(Request $request): JsonResponse {
    }

    public function sendOTP(Request $request): JsonResponse {
    }

    public function verifyOTP(Request $request): JsonResponse {
    }

    public function sendForgetPasswordMail(Request $request): JsonResponse {
    }

    public function resetPassword(Request $request): JsonResponse {
    }
}
