<?php

namespace App\Traits;

use Vinkla\Hashids\Facades\Hashids;

trait HasHashid
{
    public function getRouteKey()
    {
        return Hashids::encode($this->id);
    }

    public function getHashidAttribute()
    {
        return Hashids::encode($this->id);
    }
}
