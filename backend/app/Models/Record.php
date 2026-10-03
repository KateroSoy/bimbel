<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Generic row of a registry table (see config/resources.php). The table and casts are set by
 * App\Support\Resources::model(); values are only ever written from validated, whitelisted columns.
 */
class Record extends Model
{
    protected $guarded = ['id'];
}
