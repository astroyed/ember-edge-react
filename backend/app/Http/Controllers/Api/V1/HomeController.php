<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Product;

class HomeController extends Controller
{
    public function index()
    {
        $banners = Banner::where('is_active', true)
            ->orderBy('position', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        $newArrivals = Product::query()
            ->select([
                'id', 'name', 'slug', 'category_id', 'brand', 'price', 'sale_price',
                'is_featured', 'is_new_arrival', 'status', 'created_at',
            ])
            ->with([
                'images:id,product_id,image_path,is_primary,display_order',
                'variants:id,product_id,color',
            ])
            ->where('is_new_arrival', true)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'banners' => $banners,
                'new_arrivals' => $newArrivals,
            ],
        ]);
    }
}
