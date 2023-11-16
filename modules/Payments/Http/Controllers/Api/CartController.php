<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
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
        $carts = Cart::whereUserId(auth()->guard()->id())
            ->with([
                'course:id,user_id,thumbnail,title,slug,description,price,offer_price',
                'course.instructor:id,full_name'
            ])
            ->get();

        $totalPrice = $carts->sum(function ($cart) {
            return $cart->course->final_price;
        });

        $response = [
            'carts' => $carts,
            'total_price' => $totalPrice,
        ];

        return $this->return(200, "Cart fetched successfully", $response);
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
        return $this->return(200, "Cart deleted successfully");
    }
}
