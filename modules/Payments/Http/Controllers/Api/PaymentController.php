<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Jobs\CartPurchasedMailJob;
use App\Jobs\CoursePurchasedMailJob;
use App\Jobs\PayoutMailJob;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use modules\Courses\Entities\Course;
use modules\Payments\Entities\Cart;
use modules\Payments\Entities\EnrolledCourse;
use modules\Payments\Entities\PaymentTransaction;
use modules\Payments\Entities\PaymentTransactionItem;
use modules\Payments\Entities\Payout;
use modules\Payments\Interfaces\Payment;
use modules\Payments\Interfaces\PaymentMethods;
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
        $paymentTransaction = $this->initPaymentTransaction($description, $paymentType);
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
    private function initPaymentTransaction(string $description, int $paymentType): PaymentTransaction {
        $paymentTransaction = PaymentTransaction::create([
            'user_id' => $this->user->id,
            'payment_method' => $this->paymentMethod,
            'payment_type_id' => $paymentType,
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

    /**
     * The function "changeStatus" updates the status of a payment transaction based on the provided
     * reference number.
     * 
     * @param string referenceNumber The reference number is a unique identifier for a payment transaction.
     * It is used to locate the specific transaction that needs its status changed.
     * @param int status The status parameter is an integer that represents the new status value that you
     * want to update for the payment transaction.
     */
    public function changeStatus(string $referenceNumber, int $status): void {
        PaymentTransaction::where("reference_number", $referenceNumber)->update(['status' => $status]);
    }

    /**
     * The function "enrollCourses" enrolls a user in multiple courses by creating records in the
     * "EnrolledCourse" table and removing corresponding records from the "Cart" table.
     * 
     * @param array courseIds An array of course IDs that the user wants to enroll in.
     * @param int userId The userId parameter is an integer that represents the ID of the user who wants to
     * enroll in the courses.
     */
    public function enrollCourses(array $courseIds, int $userId): void {
        foreach ($courseIds as $courseId) {
            EnrolledCourse::create(["course_id" => $courseId, "user_id" => $userId]);
            Cart::where("user_id", $userId)->where("course_id", $courseId)->delete();
        }
    }

    /**
     * The function addToPayouts adds payment transaction items to the payouts table with generated
     * reference numbers and payment method set to PayPal.
     * 
     * @param int paymentTransactionId The paymentTransactionId is an integer that represents the ID of a
     * payment transaction.
     */
    public function addToPayouts(int $paymentTransactionId): void {
        $paymentTransactionItems = PaymentTransactionItem::join('courses', 'courses.id', 'payment_transaction_items.course_id')
            ->select([
                'payment_transaction_items.id',
                'payment_transaction_items.total_price',
                'courses.user_id as instructor_id',
            ])
            ->where("payment_transaction_id", $paymentTransactionId)->get();

        foreach ($paymentTransactionItems as $paymentTransactionItem) {
            $referenceNumber = $this->generateReferenceNumber();
            Payout::create([
                'payment_transaction_id' => $paymentTransactionId,
                'payment_transaction_items_id' => $paymentTransactionItem->id,
                'reference_number' => $referenceNumber,
                'payment_method' => PaymentMethods::PAYPAL,
                'user_id' => $paymentTransactionItem->instructor_id,
                'total_price' => $paymentTransactionItem->total_price,
            ]);
        }
    }
    /**
     * The function `pushNotification` sends a notification to a user based on a payment transaction,
     * with different types of notifications depending on the payment type.
     * 
     * @param int userId The userId parameter is the ID of the user for whom the notification is being
     * sent.
     * @param int paymentTransactionId The paymentTransactionId parameter is an integer that represents
     * the ID of a payment transaction.
     */
    public function pushNotification(int $userId, int $paymentTransactionId): void {
        $paymentTransaction = PaymentTransaction::where("id", $paymentTransactionId)->first();
        $user = User::where("id", $userId)->first();

        $data = [];
        $data['reference_number'] = $paymentTransaction->reference_number;
        $data['created_at'] = Carbon::now();

        switch ($paymentTransaction->payment_type_id) {
            case PaymentTypes::SINGLE_ITEM:
                $paymentTransactionItem = PaymentTransactionItem::join("courses", "courses.id", "payment_transaction_items.course_id")
                    ->select([
                        'courses.id',
                        'courses.title',
                        'courses.slug',
                    ])
                    ->where("payment_transaction_id", $paymentTransaction->id)
                    ->first();

                $data['title'] = $paymentTransactionItem->title;
                $data['slug'] = $paymentTransactionItem->slug;


                CoursePurchasedMailJob::dispatch($user, $data);
                break;
            case PaymentTypes::CART:
                $coursesIds = PaymentTransactionItem::select("course_id")->where("payment_transaction_id", $paymentTransaction->id)->pluck("course_id")->toArray();

                $courses = DB::table("courses")->select(['courses.title', 'courses.slug'])->whereIn("id", $coursesIds)->get();

                $data['courses'] = $courses;

                CartPurchasedMailJob::dispatch($user, $data);
                break;
            default:
                break;
        }
    }

    /**
     * The function checks the status of a payment transaction based on a given reference number and
     * returns a JSON response indicating whether the payment was successful or not.
     * 
     * @param string referenceNumber The `referenceNumber` parameter is a string that represents the
     * reference number of a payment transaction. It is used to identify a specific payment transaction in
     * the database.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function checkPayment(string $referenceNumber): JsonResponse {
        $paymentTransaction = PaymentTransaction::select('status')->where("reference_number", $referenceNumber)->first();
        if ($paymentTransaction) {
            if ($paymentTransaction->status == PaymentStatues::SUCCESS) {
                return $this->return(200, "Payment purchased successfully", ['status' => true]);
            }
            return $this->return(400, "Payment not purchased yet", ['status' => false]);
        }
        return $this->return(400, "Payment not exists", ['status' => false]);
    }

    /**
     * The `history` function retrieves the payment history of the authenticated user and returns it as a
     * JSON response.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function history(): JsonResponse {
        $user = auth()->guard("api")->user();
        $paymentHistory = PaymentTransaction::whereUserId($user->id)->orderByDesc("id")->paginate(5);
        foreach ($paymentHistory as $history) {
            $history->status = PaymentStatues::STATUES_TEXT[$history->status];
            $history->payment_type = PaymentTypes::TYPES_TEXT[$history->payment_type_id];
            $history->payment_method = PaymentMethods::METHODS_TEXT[$history->payment_method];
            $history->updated_at_diff = $history->updated_at->diffForHumans();
        }

        return $this->return(200, "Payment history fetched successfully", ['payment_history' => $paymentHistory]);
    }

    /**
     * The function retrieves payout details for a user, including total transactions and total transaction
     * price, as well as available transactions and their prices.
     * 
     * @return JsonResponse a JsonResponse with the following structure:
     */
    public function payoutDetails(): JsonResponse {
        $user = auth()->guard("api")->user();
        $payout = Payout::whereUserId($user->id);
        $data = [];

        $totals['totals'] = [
            'total_transactions' => $payout->count(),
            'total_transactions_price' => $payout->sum('total_price'),
        ];

        $available['available'] = [
            'total_transactions' => $payout->where("status", PaymentStatues::PENDING)->count(),
            'total_transactions_price' => $payout->where("status", PaymentStatues::PENDING)->sum('total_price'),
        ];

        $data = array_merge($totals, $available);

        $data['can_get_paid'] = ($data['available']['total_transactions_price'] > 0 ? true : false);
        $data['email'] = $user->email;
        $data['rate'] = Payout::PLATFORM_RATE;
        $data['currency'] = "$";
        $data['final_amount'] = $this->calculatePayOutAmount($user->id);

        return $this->return(200, "Available payout details", ['data' => $data]);
    }


    /**
     * The function calculates the payout amount for a given user by summing the total prices of payout
     * records with a status of 0, subtracting the platform rate, and returning the result.
     * 
     * @param userId The userId parameter is the unique identifier of the user for whom we want to
     * calculate the payout amount.
     * 
     * @return the calculated payout amount after deducting the platform rate.
     */
    public function calculatePayOutAmount($userId) {
        $totalPayOutAmount = Payout::whereUserId($userId)->where("status", 0)->sum('total_price');

        if ($totalPayOutAmount) {
            $totalRate = ($totalPayOutAmount * (Payout::PLATFORM_RATE / 100));
            return $totalPayOutAmount - $totalRate;
        }

        return $totalPayOutAmount;
    }

    public function payout(Request $request): JsonResponse {
        $user = auth()->guard('api')->user();

        $email = $request->email;
        $totalPrice = (float) $this->calculatePayOutAmount($user->id);
        $payload = $this->preparePayoutPayload($email, $totalPrice);

        $response = $this->sendPayout($payload);

        if ($response) {
            // mark as transferred
            Payout::whereUserId($user->id)->where("status", PaymentStatues::PENDING)
                ->update([
                    'transferred_email' => $email,
                    'status' => PaymentStatues::TRANSFERRED,
                    'transaction_number' => $response['batch_header']['payout_batch_id']
                ]);
            // send instructor mail
            $data = [
                'total_amount' => $totalPrice,
                'created_at' => Carbon::now(),
                'reference_number' => $response['batch_header']['payout_batch_id'],
            ];
            PayoutMailJob::dispatch($user, $data);
            return $this->return(200, "Paid out successfully");
        }
        return $this->return(400, "Something went wrong");
    }
    /**
     * The function prepares a payout payload with the sender's batch header and recipient details.
     * 
     * @param string email The email parameter is a string that represents the recipient's email address.
     * @param float totalPrice The `totalPrice` parameter is a float value representing the total amount of
     * money to be paid out. It is used to set the value of the payout amount in the payload.
     * 
     * @return array an array called .
     */
    private function preparePayoutPayload(string $email, float $totalPrice): array {
        $payload = [];
        $payload['sender_batch_header'] = [
            'sender_batch_id' => "Payouts_" . time(),
            'email_subject' => "You have a payout!",
            'email_message' => "You have received a payout! Thanks for using our service!",
        ];

        $payload['items'] = [[
            "recipient_type" => "EMAIL",
            "amount" => [
                "value" => $totalPrice,
                "currency" => "USD",
            ],
            "note" => "Thank you for your efforts at " . env("APP_NAME") . "!",
            "receiver" => $email,
            "notification_language" => "en-US",
        ]];

        return $payload;
    }

    /**
     * The function "sendPayout" sends a payout using the PaypalController and returns the response.
     * 
     * @param array payload The payload parameter is an array that contains the necessary data for sending
     * a payout. It could include information such as the recipient's email address, the amount to be sent,
     * and any additional details required by the payment gateway.
     * 
     * @return bool|array either a boolean value or an array.
     */
    private function sendPayout(array $payload): bool|array {
        $response = (new PaypalController)->payout($payload);
        return $response;
    }

    /**
     * The function retrieves the payout history for a user, formats the payout status, payment method,
     * and updated at time, and returns the result as a JSON response.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of "Payout
     * history fetched successfully", and an array containing the payout history data.
     */
    public function payoutHistory(): JsonResponse {
        $user = auth()->guard("api")->user();
        $payouts = Payout::where("user_id", $user->id)->orderByDesc("id")->paginate(5);
        foreach ($payouts as $payout) {
            $payout->status = PaymentStatues::STATUES_TEXT[$payout->status];
            $payout->payment_method = PaymentMethods::METHODS_TEXT[$payout->payment_method];
            $payout->updated_at_diff = $payout->updated_at->diffForHumans();
        }
        return $this->return(200, "Payout history fetched successfully", ['payout_history' => $payouts]);
    }
}
