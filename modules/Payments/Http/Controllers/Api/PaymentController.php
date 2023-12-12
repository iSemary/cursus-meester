<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use modules\Courses\Entities\Course;
use modules\Payments\Entities\Cart;
use modules\Payments\Entities\EnrolledCourse;
use modules\Payments\Entities\PaymentTransaction;
use modules\Payments\Entities\PaymentTransactionItem;
use modules\Payments\Interfaces\Payment;
use modules\Payments\Interfaces\PaymentStatues;
use modules\Payments\Interfaces\PaymentTypes;

class PaymentController extends ApiController {
    private User|null $user;
    private Course $course;
    private Collection $courses;
    private float $totalPrice;
    private array $orders;
    private int $paymentMethod;
    private string $referenceNumber;
    private int $paymentTransactionId;

    public function __construct() {
        $this->user = auth()->guard('api')->user();
    }

    /**
     * The function "purchaseCourse" initializes a payment for a single course based on the provided course
     * ID and payment method.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of the course that
     * the user wants to purchase.
     * @param Request request The `` parameter is an instance of the `Request` class, which is
     * typically used in web frameworks like Laravel to handle incoming HTTP requests. It contains
     * information about the current request, such as the HTTP method, request headers, request parameters,
     * and more.
     * 
     * @return The method is returning the result of the `init` method call.
     */
    public function purchaseCourse(int $courseId, Request $request) {
        $this->paymentMethod = $request->payment_method;
        $description = "Single Course";
        $this->course = Course::where("id", $courseId)->first();
        $this->totalPrice = $this->course->final_price;
        return $this->init($description, PaymentTypes::SINGLE_ITEM);
    }

    /**
     * The function "purchaseCart" initializes a payment process for the items in the user's cart.
     * 
     * @param Request request The `` parameter is an instance of the `Request` class, which is used
     * to retrieve data from the HTTP request. In this case, it is used to retrieve the payment method
     * selected by the user.
     * 
     * @return the result of the `init()` method with the parameters `` and
     * `PaymentTypes::CART`.
     */
    public function purchaseCart(Request $request) {
        $this->paymentMethod = $request->payment_method;
        $description = "Cart";

        $cartCourseIds = Cart::whereUserId($this->user->id)->pluck("course_id")->toArray();
        $this->courses = Course::selectPreview()->whereIn("id", $cartCourseIds)->get();
        $cartPrices = CartController::calculateCartPrice($this->courses);
        $this->totalPrice = $cartPrices['total_price'];

        return $this->init($description, PaymentTypes::CART);
    }

    /**
     * The init function initializes a payment transaction and prepares orders based on the payment
     * type.
     * 
     * @param string description A string that describes the payment transaction. It could be the name
     * of a course or a brief description of the items being purchased.
     * @param int paymentType The paymentType parameter is an integer that represents the type of
     * payment being made. It can have two possible values:
     * 
     * @return the result of the method calls to `prepareOrders()`.
     */
    private function init(string $description, int $paymentType) {
        $this->referenceNumber = $this->generateReferenceNumber();
        $paymentTransaction = $this->initPaymentTransaction($description);
        switch ($paymentType) {
            case PaymentTypes::SINGLE_ITEM:
                $this->initPaymentTransactionItem($paymentTransaction->id, $this->course);
                return $this->prepareOrders([$this->course]);
                break;
            case PaymentTypes::CART:
                foreach ($this->courses as $course) {
                    $this->initPaymentTransactionItem($paymentTransaction->id, $course);
                }
                return $this->prepareOrders($this->courses);
                break;
            default:
                abort(500, "Invalid Payment Type");
                break;
        }
    }

    /**
     * The function prepares an array of orders by extracting specific properties from each item in the
     * input array and then creates an order using the prepared data.
     * 
     * @param array items An array of objects representing items. Each item object has the following
     * properties:
     * 
     * @return the result of calling the `createOrder()` method.
     */
    private function prepareOrders(array|Collection $items) {
        $orders = [];
        foreach ($items as $item) {
            $preparedItem['name'] = $item->title;
            $preparedItem['description'] = $item->description;
            $preparedItem['price'] = $item->final_price;

            $orders[] = $preparedItem;
        }
        $this->orders = $orders;
        return $this->createOrder();
    }

    /**
     * The createOrder function checks the payment method and initiates a payment transaction using Stripe
     * if the payment method is 1.
     * 
     * @return this code snippet, if the payment method is 1, it will return the result of the `init`
     * method from the `StripeController` class, passing in the payment transaction ID and orders as
     * arguments. If the payment method is 2 or any other value, nothing is being returned.
     */
    private function createOrder() {
        switch ($this->paymentMethod) {
            case 1:
                return (new StripeController)->init($this->paymentTransactionId, $this->referenceNumber, $this->orders);
                break;
            case 2:
                return (new PaypalController)->init($this->paymentTransactionId, $this->referenceNumber, $this->orders);
                break;
            default:
                break;
        }
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
        $paymentTransaction = PaymentTransaction::create([
            'user_id' => $this->user->id,
            'payment_method' => $this->paymentMethod,
            'status' => PaymentStatues::PENDING,
            'reference_number' => $this->referenceNumber,
            'description' => $description,
            'expire_at' => Carbon::now()->addMinutes(Payment::EXPIRE_AFTER_MINUTES),
            'total_price' => $this->totalPrice
        ]);
        $this->paymentTransactionId = $paymentTransaction->id;
        return $paymentTransaction;
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


    public function changeStatus(string $transactionNumber, int $status) {
        PaymentTransaction::where("transaction_number", $transactionNumber)->update(['status' => $status]);
    }

    public function enrollCourses(array $courseIds, int $userId): void {
        foreach ($courseIds as $courseId) {
            EnrolledCourse::create(["course_id" => $courseId, "user_id" => $userId]);
            Cart::where("user_id", $userId)->where("course_id", $courseId)->delete();
        }
    }

    public function checkPayment($referenceNumber) {
        $paymentTransaction = PaymentTransaction::select('status')->where("reference_number", $referenceNumber)->first();
        if ($paymentTransaction) {
            if ($paymentTransaction->status == PaymentStatues::SUCCESS) {
                return $this->return(400, "Payment purchased successfully", ['status' => true]);
            }
            return $this->return(400, "Payment not purchased yet", ['status' => false]);
        }
        return $this->return(400, "Payment not exists", ['status' => false]);
    }
}
