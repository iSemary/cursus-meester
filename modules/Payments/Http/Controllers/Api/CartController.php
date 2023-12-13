<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Courses\Entities\Course;
use modules\Courses\Http\Controllers\Api\ListController;
use modules\Payments\Http\Requests\CreateCartRequest;
use modules\Payments\Entities\Cart;

class CartController extends ApiController {

    /**
     * The function retrieves the user's carts and calculates the total price of the courses in the carts.
     * 
     * @return JsonResponse The code is returning a JSON response with a status code of 200, a message of
     * "Cart fetched successfully", and an array containing the 'carts' and 'total_price' values.
     */
    public function index(): JsonResponse {
        $cartCourseIds = Cart::whereUserId(auth()->user()->id)->orderByDesc("id")->pluck("course_id");

        $courses = Course::selectPreview()
            ->whereIn("id", $cartCourseIds)
            ->with(["instructor" => function ($query) {
                $query->select(['id', 'full_name', 'username']);
            }])
            ->get();

        $cartPrice = self::calculateCartPrice($courses);
        
        $response = [
            'courses' => $courses,
            'total_price' => number_format($cartPrice['total_price']),
            'discount_price' => number_format($cartPrice['discount_price']),
            'discount_percentage' => abs(round($cartPrice['discount_percentage'], 2)),
            'currency' => "$" // TODO dynamic currency
        ];

        return $this->return(200, "Cart fetched successfully", $response);
    }

    public static function calculateCartPrice($courses): array {
        $totalPrice = $courses->sum(function ($course) {
            return $course->final_price;
        });

        $discountPrice = $courses->sum(function ($course) {
            return $course->price;
        });

        $discountPercentage = $totalPrice > 0 ? (($totalPrice - $discountPrice) / $totalPrice) * 100 : 0;

        return [
            'total_price' => $totalPrice,
            'discount_price' => $discountPrice,
            'discount_percentage' => $discountPercentage
        ];
    }

    /**
     * The function stores a cart in the database with the user ID and course ID provided in the request.
     * 
     * @param CreateCartRequest createRateRequest The parameter `` is an instance of the
     * `CreateCartRequest` class. It is used to validate and retrieve the data needed to create a new cart.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message of "Cart created
     * successfully".
     */
    public function store(CreateCartRequest $createRateRequest): JsonResponse {
        Cart::updateOrCreate([
            'user_id' => auth()->guard('api')->id(),
            'course_id' => $createRateRequest->validated()['course_id']
        ]);
        return $this->return(200, "Cart created successfully");
    }


    /**
     * The function moves a cart item to the wishlist and returns a success message.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of the course that
     * needs to be moved from the cart to the wishlist.
     * @param ListController listController The `listController` parameter is an instance of the
     * `ListController` class. It is used to access the methods and properties of the `ListController`
     * class within the `moveToWishlist` method.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function moveToWishlist(int $courseId, ListController $listController): JsonResponse {
        Cart::whereUserId(auth()->guard()->id())->whereCourseId($courseId)->delete();
        $listController->setWishList($courseId);
        return $this->return(200, "Cart item moved to wishlist successfully");
    }

    /**
     * The `destroy` function deletes a cart item with a specific course ID for the authenticated user and
     * returns a success message.
     * 
     * @param int courseId The  parameter is the identifier of the course that needs to be deleted
     * from the cart.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message "Cart deleted
     * successfully".
     */
    public function destroy(int $courseId): JsonResponse {
        Cart::whereUserId(auth()->guard()->id())->where("course_id", $courseId)->delete();
        return $this->return(200, "Cart updated successfully");
    }
}
