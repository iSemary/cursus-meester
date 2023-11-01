<?php

namespace modules\Students\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Students\Entities\StudentProfile;
use modules\Students\Http\Requests\UpdateProfileRequest;

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
     * The function updates the profile of a student user with the provided bio and position information.
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
        // TODO Image Uploader
        StudentProfile::updateOrCreate(['user_id' => $user->id], [
            'bio' => $updateProfileRequest->bio,
            'position' => $updateProfileRequest->position,
        ]);

        return $this->return(200, 'Profile updated successfully');
    }
}
