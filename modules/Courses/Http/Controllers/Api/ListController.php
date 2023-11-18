<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\Wishlist;
use modules\Payments\Entities\Cart;
use modules\Payments\Entities\EnrolledCourse;
use modules\Payments\Http\Controllers\Api\CartController;

class ListController extends ApiController {

    public function getWishList(): JsonResponse {
        $wishlistCoursesIds = Wishlist::whereUserId(auth()->user()->id)->orderByDesc("id")->pluck("course_id");

        $courses = Course::selectPreview()
            ->whereIn("id", $wishlistCoursesIds)
            ->with(["instructor" => function ($query) {
                $query->select(['id', 'full_name', 'username']);
            }])
            ->paginate(4);
        return $this->return(200, "Wishlist fetched successfully", ['courses' => $courses]);
    }

    public function setWishList($courseId): JsonResponse {
        Wishlist::updateOrCreate([
            'user_id' => auth()->user()->id,
            'course_id' => $courseId,
        ]);
        return $this->return(200, "Wishlist updated successfully");
    }

    public function moveToCart(int $courseId): JsonResponse {
        Wishlist::whereUserId(auth()->guard()->id())->whereCourseId($courseId)->delete();
        Cart::updateOrCreate([
            'user_id' => auth()->guard('api')->id(),
            'course_id' => $courseId
        ]);
        return $this->return(200, "Wishlist item moved to cart successfully");
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
        $enrolledCoursesIds = EnrolledCourse::whereUserId(auth()->user()->id)->orderByDesc("id")->pluck("course_id");

        $courses = Course::selectPreview()
            ->whereIn("id", $enrolledCoursesIds)
            ->with(["instructor" => function ($query) {
                $query->select(['id', 'full_name', 'username']);
            }])
            ->paginate(4);
        return $this->return(200, "Your courses fetched successfully", ['courses' => $courses]);
    }
}
