<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserSearch extends Model {
    use SoftDeletes;
    protected $fillable = ['user_id', 'keyword'];
}
