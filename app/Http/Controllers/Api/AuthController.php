<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\ForgetPasswordRequest;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\OTP\SendRequest;
use App\Http\Requests\OTP\VerifyRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Jobs\AttemptMailJob;
use App\Jobs\ForgetPasswordMailJob;
use App\Jobs\RegistrationMailJob;
use App\Jobs\SendOTP;
use App\Models\Auth\EmailToken;
use App\Models\Auth\LoginAttempt;
use App\Models\User;
use App\Models\Auth\UserOTP;
use Carbon\Carbon;
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
        // Create email token
        $token = EmailToken::createToken($user->id);
        // Fire Email Confirmation Queue
        RegistrationMailJob::dispatchAfterResponse($user, $token);
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
            $user = User::where("email", $request->email)->first();
            if ($user) {
                $loginAttempt = LoginAttempt::create([
                    'user_id' => $user->id,
                    'agent' => $request->userAgent(),
                    'ip' => $request->ip(),
                ]);
                // send warning email
                AttemptMailJob::dispatchAfterResponse($user, $loginAttempt);
            } else {
                // check if user is deactivated 
                $checkTrashedUser = User::where("email", $request->email)->withTrashed()->first();
                if ($checkTrashedUser) {
                    User::where("email", $request->email)->withTrashed()->restore();
                    if (auth()->attempt(['email' => $request->email, 'password' => $request->password])) {
                        $user = auth()->user();
                        // collect user details to return in the json response
                        $response = $this->collectUserDetails($user);
                        return $this->return(200, 'Account recovered successfully', ['user' => $response]);
                    } else {
                        // rollback 
                        User::where("email", $request->email)->update(['deleted_at' => $checkTrashedUser->deleted_at]);
                    }
                }
            }
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
        $accessToken = $user->createToken('web-app')->accessToken;
        // Fetch only specific data of user model
        $user = $user->select('full_name', 'email', 'created_at')->first();
        $user['access_token'] = $accessToken;
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
                $user->tokens->each(function ($token, $key) use ($user) {
                    if ($token->id !== $user->token()['id']) {
                        $token->delete();
                    }
                });
            }
            return $this->return(200, 'Logged out successfully');
        } catch (Exception $e) {
            return $this->return(400, 'Couldn\'t logout using this token', [], ['e' => $e->getMessage()]);
        }
    }

    /**
     * The function `verifyEmail` takes a token as input, verifies it, and updates the `email_verified_at`
     * field of the user if the token is valid.
     * 
     * @param string token The `token` parameter is a string that represents a verification token. This
     * token is used to verify the user's email address.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function verifyEmail(string $token): JsonResponse {
        if (isset($token)) {
            try {
                $verifyToken = User::verifyToken($token);
                if ($verifyToken) {
                    $verifyToken->update([
                        'email_verified_at' => Carbon::now()
                    ]);
                    return $this->return(200, "Email Verified Successfully");
                } else {
                    return $this->return(400, "Token is expired");
                }
            } catch (Exception $e) {
                return $this->return(400, "Invalid Token");
            }
        }
    }

    /**
     * The function generates a random OTP (One-Time Password), saves it in the database for the
     * authenticated user, and returns a success message.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message of "OTP sent
     * successfully".
     */
    public function sendOTP(): JsonResponse {
        $user = auth()->guard('api')->user();
        if ($user->phone) {
            // generate random otp
            $otp = random_int(1000, 9999);
            // Create user otp record
            UserOTP::create([
                'user_id' => $user->id,
                'otp' => $otp
            ]);
            // Fire send SMS queue with otp
            SendOTP::dispatch($user->phone, $otp);
            return $this->return(200, "OTP sent successfully");
        }
        return $this->return(400, "Phone number not exists");
    }

    /**
     * The function `verifyOTP` verifies the OTP (One-Time Password) provided by the user and updates the
     * user's phone number verification status accordingly.
     * 
     * @param VerifyRequest request The request parameter is an instance of the VerifyRequest class, which
     * is likely a custom class that contains the data needed to verify the OTP (One-Time Password).
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function verifyOTP(VerifyRequest $request): JsonResponse {
        $user = User::join('user_otps', 'user_otps.user_id', 'users.id')
            ->where('user_otps.otp', $request->otp)
            ->where('user_otps.user_id', auth()->guard('api')->id())
            ->first();
        if ($user) {
            User::verifyPhoneNumber(auth()->guard('api')->id());
            return $this->return(200, "OTP verified successfully");
        } else {
            return $this->return(400, "Invalid OTP");
        }
    }

    /**
     * The forgetPassword function generates a reset token for a user's email and sends a reset email.
     * 
     * @param ForgetPasswordRequest request The  parameter is an instance of the
     * ForgetPasswordRequest class. It is used to retrieve the email entered by the user who wants to
     * reset their password.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message "Reset email has been
     * sent successfully".
     */
    public function forgetPassword(ForgetPasswordRequest $request): JsonResponse {
        $user = User::select(['id', 'full_name', 'email'])->where("email", $request->email)->first();
        $token = $user->createResetToken();
        // Send reset password link
        ForgetPasswordMailJob::dispatchAfterResponse($user, $token);
        return $this->return(200, "Reset email has been sent successfully");
    }

    /**
     * The function resets a user's password by fetching the user from the database using a token, updating
     * the password, and deleting the reset token from the database.
     * 
     * @param ResetPasswordRequest request The request parameter is an instance of the ResetPasswordRequest
     * class. It contains the data sent in the request, such as the token and the new password.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse {
        // Fetch the user by the token from the database
        $user = User::join("password_reset_tokens", "password_reset_tokens.user_id", "users.id")
            ->select(['users.id'])
            ->where("password_reset_tokens.token", $request->token)
            ->first();
        if ($user) {
            // Reset the user's password
            $user->updatePassword($request->password);
            // clear reset token from database
            DB::table('password_reset_tokens')->where("token", $request->token)->delete();
            return $this->return(200, "Password has been reset successfully");
        } else {
            return $this->return(400, "User not exists");
        }
    }

    /**
     * The function checks if the user is authenticated and returns a JSON response indicating the
     * authentication status.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function checkAuthentication(): JsonResponse {
        if (auth()->guard('api')->check()) {
            return $this->return(200, "Authenticated successfully");
        }
        return $this->return(400, "Session expired");
    }

    /**
     * The function retrieves the authenticated user details and returns a JSON response with the user
     * information.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function getUser(): JsonResponse {
        $auth = auth()->guard('api')->user();
        $user = $this->collectUserDetails($auth);
        return $this->return(200, "User fetched successfully", ['user' => $user]);
    }

    /**
     * The function "attempts" retrieves login attempts made by the authenticated user and returns them as
     * a JSON response.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function attempts(): JsonResponse {
        $attempts = LoginAttempt::select(['ip', 'agent', 'created_at'])->where('user_id', auth()->guard('api')->id())->orderBy('id', 'DESC')->paginate(5);
        return $this->return(200, 'Attempts fetched successfully', ['data' => $attempts]);
    }
}
