<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bicycle extends Model
{
    protected $fillable = ['brand', 'model', 'color', 'frame_size', 'active'];

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }
}
