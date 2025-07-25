<?php

namespace App\Traits;

use Vinkla\Hashids\Facades\Hashids;

trait HasHashid
{
    public function getRouteKey()
    {
        return Hashids::encode($this->getKey());
    }

    public function resolveRouteBinding($value, $field = null)
    {
        $decoded = Hashids::decode($value);
        if (count($decoded) === 0) return null;
        return $this->where('id', $decoded[0])->firstOrFail();
    }
}
