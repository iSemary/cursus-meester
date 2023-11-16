<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Courses\Entities\Wishlist;
use modules\Payments\Entities\EnrolledCourse;

class ListController extends ApiController {

    public function getWishList(): JsonResponse {
        $wishlist = Wishlist::whereUserId(auth()->user()->id)->orderByDesc("id")
            ->with(["course" => function ($query) {
                $query->select('id', 'user_id', 'thumbnail', 'title', 'slug', 'description', 'price', 'offer_price')
                    ->with('instructor:id,full_name');
            }])
            ->paginate(20);
        return $this->return(200, "Wishlist fetched successfully", ['wishlist' => $wishlist]);
    }

    public function setWishList($courseId): JsonResponse {
        Wishlist::updateOrCreate([
            'user_id' => auth()->user()->id,
            'course_id' => $courseId,
        ]);
        return $this->return(200, "Wishlist updated successfully");
    }

    public function deleteWishList($courseId): JsonResponse {
        $wishlistItem = Wishlist::whereUserId(auth()->user()->id)
            ->where('course_id', $courseId)
            ->first();
        if ($wishlistItem) {
            $wishlistItem->deleted_at = now();
            $wishlistItem->save();
        }
        return $this->return(200, "Wishlist deleted successfully");
    }

    public function getEnrolledCourses(): JsonResponse {
        $courses = EnrolledCourse::whereUserId(auth()->user()->id)->orderByDesc("id")
            ->with(["course" => function ($query) {
                $query->select('id', 'user_id', 'thumbnail', 'title', 'slug', 'description', 'price', 'offer_price')
                    ->with('user:id,full_name');
            }])
            ->paginate(20);
        return $this->return(200, "Your courses fetched successfully", ['courses' => $courses]);
    }
}
