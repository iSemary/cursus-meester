<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Courses\Entities\Course;
use modules\Payments\Entities\Cart;
use modules\Payments\Entities\PaymentTransaction;
use modules\Payments\Entities\PaymentTransactionItem;
use modules\Payments\Interfaces\Payment;
use modules\Payments\Interfaces\PaymentStatues;
use modules\Payments\Interfaces\PaymentTypes;

class PaymentController extends ApiController {
    private User $user;
    private $course;
    private $courses;
    private float $totalPrice;
    private $cart;
    private int $paymentMethod;
    private string $referenceNumber;

    public function __construct() {
        $this->user = auth()->guard('api')->user();
    }

    public function purchaseCourse(int $courseId, Request $request) {
        $this->paymentMethod = $request->payment_method;
        $description = "Single Course";
        $this->course = Course::where("id", $courseId)->first();
        $this->totalPrice = $this->course->final_price;
        return $this->init($description, PaymentTypes::SINGLE_ITEM);
    }

    public function purchaseCart(Request $request) {
        $this->paymentMethod = $request->payment_method;
        $description = "Cart";

        $cartCourseIds = Cart::whereUserId($this->user->id)->pluck("course_id");
        $this->courses = Course::selectPreview()->whereIn("id", $cartCourseIds)->get();
        $cartPrices = CartController::calculateCartPrice($this->courses);
        $this->totalPrice = $cartPrices['total_price'];

        return $this->init($description, PaymentTypes::CART);
    }

    private function init(string $description, int $paymentType) {
        $this->referenceNumber = $this->generateReferenceNumber();
        $paymentTransaction = $this->initPaymentTransaction($description);
        $orders = [];
        switch ($paymentType) {
            case PaymentTypes::SINGLE_ITEM:
                $this->initPaymentTransactionItem($paymentTransaction->id, $this->course);
                break;
            case PaymentTypes::CART:
                foreach ($this->courses as $course) {
                    $this->initPaymentTransactionItem($paymentTransaction->id, $course);
                }
                break;
            default:
                abort(500, "Invalid Payment Type");
                break;
        }

        return (new StripeController)->createOrder($orders);
    }




    /**
     * The function `initPaymentTransaction` creates a new payment transaction with the given description
     * and returns it.
     * 
     * @param string description A string that describes the payment transaction.
     * 
     * @return PaymentTransaction a PaymentTransaction object.
     */
    private function initPaymentTransaction(string $description): PaymentTransaction {
        return PaymentTransaction::create([
            'user_id' => $this->user->id,
            'payment_method' => $this->paymentMethod,
            'status' => PaymentStatues::PENDING,
            'reference_number' => $this->referenceNumber,
            'description' => $description,
            'expire_at' => Carbon::now()->addMinutes(Payment::EXPIRE_AFTER_MINUTES),
            'total_price' => $this->totalPrice
        ]);
    }

    /**
     * The function initializes a payment transaction item with the given payment transaction ID and course
     * details.
     * 
     * @param paymentTransactionId The paymentTransactionId is the unique identifier for the payment
     * transaction. It is used to associate the payment transaction item with a specific payment
     * transaction.
     * @param course The "course" parameter is an object that represents a course. It likely has properties
     * such as "id" (the course ID), "price" (the original price of the course), "offer_price" (the
     * discounted price of the course), and "final_price" (the final price after
     */
    private function initPaymentTransactionItem($paymentTransactionId, $course): void {
        PaymentTransactionItem::create([
            'payment_transaction_id' => $paymentTransactionId,
            'course_id' => $course->id,
            'price' => $course->price,
            'offer_price' => $course->offer_price,
            'total_price' => $course->final_price,
            'status' => PaymentStatues::PENDING,
        ]);
    }

    /**
     * The function generates a random reference number of a specified length using alphanumeric
     * characters.
     * 
     * @return string a string value, which is the generated reference number.
     */
    private function generateReferenceNumber(): string {
        $referenceNumber = '';
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $length = Payment::REFERENCE_NUMBER_LENGTH;
        $max = strlen($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $referenceNumber .= $characters[mt_rand(0, $max)];
        }
        return $referenceNumber;
    }



    public function callback(): void {
    }
}
