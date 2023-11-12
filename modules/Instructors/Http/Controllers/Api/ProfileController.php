<?php

namespace modules\Instructors\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Instructors\Entities\InstructorProfile;
use modules\Instructors\Http\Requests\UpdateProfileRequest;

class ProfileController extends ApiController {
    /**
     * The function "getProfile" returns a JSON response with a success message and a status code of 200.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function getProfile(): JsonResponse {
        return $this->return(200, 'Profile fetched successfully');
    }

    /**
     * The function updates the profile of a instructor user with the provided bio and position information.
     * 
     * @param UpdateProfileRequest updateProfileRequest The  parameter is an instance
     * of the UpdateProfileRequest class. It is used to validate and retrieve the data sent in the request
     * to update the user's profile.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message of 'Profile updated
     * successfully'.
     */
    public function updateProfile(UpdateProfileRequest $updateProfileRequest): JsonResponse {
        $user = auth()->guard('api')->user();
        $avatar = null;
        if ($updateProfileRequest->file('new_avatar')) {
            $avatar = $updateProfileRequest->file('new_avatar');
        }
        InstructorProfile::updateOrCreate(['user_id' => $user->id], [
            'bio' => $updateProfileRequest->bio,
            'position' => $updateProfileRequest->position,
            'industry_id' => $updateProfileRequest->industry_id,
            'organization_id' => $updateProfileRequest->organization_id,
            'avatar' => $avatar
        ]);

        return $this->return(200, 'Profile updated successfully');
    }
}
