<?php

namespace modules\Payments\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentTransaction extends Model {
    use HasFactory;

    protected $fillable = ['user_id', 'status', 'payment_method', 'reference_number', 'transaction_number', 'description', 'total_price', 'expire_at'];
}
