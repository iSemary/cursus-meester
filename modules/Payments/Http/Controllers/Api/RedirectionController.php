<?php

namespace modules\Payments\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class RedirectionController extends ApiController {


    public function success(): View {
        $referenceNumber = request()->reference_number ?? "";
        return view("callback.payments.stripe.success", compact("referenceNumber"));
    }

    /**
     * The function returns a view for cancelling a Stripe payment callback.
     * 
     * @return View A view named "callback.payments.stripe.cancel" is being returned.
     */
    public function cancel(): View {
        $referenceNumber = request()->reference_number ?? "";
        return view("callback.payments.stripe.cancel", compact("referenceNumber"));
    }
}
