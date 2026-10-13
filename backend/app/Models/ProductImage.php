<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path',
        'is_primary',
        'display_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function getImagePathAttribute($value)
    {
        if (filter_var($value, FILTER_VALIDATE_URL) || str_starts_with($value, '/')) {
            return $value;
        }

        return Storage::disk('public')->url('products/' . $value);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
