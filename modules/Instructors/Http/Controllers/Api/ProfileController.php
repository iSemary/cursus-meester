<?php

namespace modules\Instructors\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use modules\Instructors\Entities\InstructorProfile;
use modules\Instructors\Http\Requests\UpdateProfileRequest;
use stdClass;

class ProfileController extends ApiController {

    public function getProfile(string $username): JsonResponse {
        $user = User::select('id')->where("username", $username)->first();
        if ($user) {
            $instructor = new stdClass();
            $instructor->info = InstructorProfile::getPublicInfo($user->id);
            $instructor->social_links = InstructorProfile::getSocialLinks($user->id);
            $instructor->courses = InstructorProfile::getCourses($user->id);
            return $this->return(200, 'Instructor details fetched', ['instructor' => $instructor]);
        } else {
            return $this->return(409, 'Invalid username');
        }
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
        $user = User::whereId(auth()->guard('api')->id())->first();
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
        
        if (!$user->hasRole('instructor')) {
            $user->assignRole("instructor");
        }

        return $this->return(200, 'Profile updated successfully');
    }
}
