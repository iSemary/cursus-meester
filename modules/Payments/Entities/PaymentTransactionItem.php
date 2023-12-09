<?php

namespace modules\Payments\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentTransactionItem extends Model {
    use HasFactory;

    protected $fillable = ['payment_transaction_id', 'course_id', 'price', 'offer_price', 'total_price', 'status'];
}
