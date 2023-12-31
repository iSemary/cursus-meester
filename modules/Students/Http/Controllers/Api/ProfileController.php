<?php

namespace modules\Students\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use App\Models\Utilities\ProfileSocialLink;
use Illuminate\Http\JsonResponse;
use modules\Students\Entities\StudentProfile;
use modules\Students\Http\Requests\UpdateProfileRequest;
use stdClass;

class ProfileController extends ApiController {

    public function getProfile(string $username): JsonResponse {
        $user = User::select('id')->where("username", $username)->first();
        if ($user) {
            $student = new stdClass();
            $student->info = StudentProfile::getPublicInfo($user->id);
            $student->social_links = StudentProfile::getSocialLinks($user->id);
            $student->courses = StudentProfile::getCourses($user->id);
            return $this->return(200, 'Student details fetched', ['student' => $student]);
        } else {
            return $this->return(409, 'Invalid username');
        }
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
        $authUser = auth()->guard('api')->user();
        // update main user details
        User::find($authUser->id)->update([
            'full_name' => $updateProfileRequest->full_name,
            'email' => $updateProfileRequest->email,
            'username' => $updateProfileRequest->username,
            'phone' => $updateProfileRequest->phone,
            'country_id' => $updateProfileRequest->country_id,
            'language_id' => $updateProfileRequest->language_id,
        ]);
        // update student profile
        $this->updateStudentProfile($authUser, $updateProfileRequest);
        // update social links
        if ($updateProfileRequest->social_links && is_array($updateProfileRequest->social_links)) {
            $this->updateProfileLinks($authUser, $updateProfileRequest->social_links);
        }
        return $this->return(200, 'Profile updated successfully');
    }

    /**
     * The function updates the student profile with the provided information or creates a new profile if
     * it doesn't exist.
     * 
     * @param authUser The  parameter is the authenticated user object. It represents the
     * currently logged-in user who is updating their student profile.
     * @param updateProfileRequest The  parameter is an object that contains the
     * updated profile information for a student. It likely includes properties such as 'bio', 'position',
     * and 'avatar', which represent the student's biography, position, and avatar image respectively.
     */
    public function updateStudentProfile($authUser, $updateProfileRequest) {
        $avatar = null;
        if ($updateProfileRequest->file('new_avatar')) {
            $avatar = $updateProfileRequest->file('new_avatar');
        }
        StudentProfile::updateOrCreate(['user_id' => $authUser->id], [
            'bio' => $updateProfileRequest->bio,
            'position' => $updateProfileRequest->position,
            'avatar' => $avatar
        ]);
    }

    /**
     * The function updates the social links of a user's profile.
     * 
     * @param authUser The authUser parameter is an instance of the authenticated user. It represents the
     * user who is currently logged in and making the request to update their profile links.
     * @param socialLinks An array of social links that the user wants to update in their profile. Each
     * social link should be in the format of ['platform' => 'link'], where 'platform' is the name of the
     * social media platform (e.g., 'Facebook', 'Twitter') and 'link' is the URL
     */
    public function updateProfileLinks($authUser, $socialLinks) {
        ProfileSocialLink::syncLinks($authUser->id, $socialLinks);
    }
}
