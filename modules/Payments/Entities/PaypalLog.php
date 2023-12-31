<?php

namespace modules\Payments\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaypalLog extends Model {
    use HasFactory;

    protected $fillable = [
        'transaction_number',
        'status',
        'payload',
        'response',
        'notification',
    ];
}
