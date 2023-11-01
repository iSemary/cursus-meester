<?php

namespace App\Models\Utilities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model {
    use HasFactory, SoftDeletes;
    protected $fillable = ['iso', 'name', 'iso3', 'num_code', 'phone_code', 'continent_code', 'status'];
}
