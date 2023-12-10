<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class RedirectionController extends ApiController {
    
    public function callback(Request $request): void {
        $stripeTransactionNumber = $request['data']['object']['id'];
        if ($stripeTransactionNumber) {
            $notification = $request->all();
            (new StripeController)->callback($notification);
        }
    }

    public function success(): View {
        return view("callback.payments.stripe.success");
    }

    /**
     * The function returns a view for cancelling a Stripe payment callback.
     * 
     * @return View A view named "callback.payments.stripe.cancel" is being returned.
     */
    public function cancel(): View {
        return view("callback.payments.stripe.cancel");
    }
}
