<?php

namespace modules\Payments\Entities;

use Illuminate\Database\Eloquent\Model;

class Payout extends Model {

    public const PLATFORM_RATE = 20.00;

    protected $fillable = ['payment_transaction_id', 'payment_transaction_items_id', 'transferred_email', 'total_price', 'reference_number', 'transaction_number', 'payment_method', 'user_id', 'status', 'paid_at'];
}
