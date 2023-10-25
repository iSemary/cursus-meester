<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserOTP extends Model {
    use HasFactory;

    protected $fillable = ['user_id', 'otp', 'status'];

    public $table = "user_otps";
}
