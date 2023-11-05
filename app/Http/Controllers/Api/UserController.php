<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\User\UpdatePasswordRequest;
use App\Models\User;
use App\Models\Utilities\ProfileSocialLink;
use Illuminate\Http\JsonResponse;
use modules\Instructors\Entities\InstructorProfile;
use modules\Students\Entities\StudentProfile;
use stdClass;

class UserController extends ApiController {
    /**
     * The function updates the password of the authenticated user in the database.
     * 
     * @param UpdatePasswordRequest updatePasswordRequest The  parameter is an
     * instance of the UpdatePasswordRequest class. It is used to validate and retrieve the new password
     * value from the request.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function updatePassword(UpdatePasswordRequest $updatePasswordRequest): JsonResponse {
        $userId = auth()->guard('api')->id();

        User::where("id", $userId)->update([
            'password' => bcrypt($updatePasswordRequest->password),
            'last_password_at' => now()
        ]);

        return $this->return(200, "Password updated successfully");
    }


    /**
     * The function toggles the factor authentication status of the currently authenticated user and
     * returns a JSON response with a success message.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function toggleFactorAuthenticate(): JsonResponse {
        $user = auth()->guard('api')->user();
        User::where("id", $user->id)->update([
            'factor_authenticate' => !$user->factor_authenticate
        ]);
        return $this->return(200, "Factor Authenticate updated successfully");
    }

    /**
     * The getUserDetails function retrieves the user details, including the user object, student
     * profile, instructor profile, and social links, and returns them in a JSON response.
     * 
     * @return JsonResponse a JsonResponse with the following data:
     * - Status code: 200
     * - Message: "User details fetched successfully"
     * - Data: An object containing the user details, student profile, instructor profile, and social
     * links.
     */
    public function getUserDetails(): JsonResponse {
        $user = auth()->guard('api')->user();
        $response = new stdClass();

        $response->user = $user;
        $response->student_profile = (object) StudentProfile::select(['bio', 'position', 'avatar'])->where("user_id", $user->id)->first();
        $response->instructor_profile = (object) InstructorProfile::select(['bio', 'position'])->where("user_id", $user->id)->first();
        $response->social_links = (object) ProfileSocialLink::select(['link_type', 'link_url'])->where("user_id", $user->id)->get();

        return $this->return(200, "User details fetched successfully", ['data' => $response]);
    }

    public function deactivate(): JsonResponse {
        $user = auth()->guard('api')->user();
        // Revoke all tokens
        $user->tokens->each(function ($token, $key) {
            $token->delete();
        });
        // set user as soft deleted 
        $user->delete();
        return $this->return(200, "Account deactivated successfully");
    }
}
