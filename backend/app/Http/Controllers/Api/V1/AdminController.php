<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue' => Order::where('payment_status', 'completed')->sum('total_amount'),
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_products' => Product::count(),
                'low_stock_variants' => ProductVariant::where('stock_quantity', '<=', 5)->count(),
                'total_customers' => User::where('role', 'customer')->count(),
                'recent_orders' => Order::with('user')->orderBy('created_at', 'desc')->limit(5)->get(),
            ]
        ]);
    }

    public function products(Request $request)
    {
        $products = Product::with(['category', 'images', 'variants'])->orderBy('created_at', 'desc')->paginate(15);
        return response()->json(['success' => true, 'data' => $products]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'status' => 'in:draft,active,archived',
            'image_url' => 'nullable|string',
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'required|string',
            'variants.*.size' => 'required|string',
            'variants.*.sku' => 'required|string|unique:product_variants,sku',
            'variants.*.stock_quantity' => 'required|integer|min:0',
        ]);

        $slug = Str::slug($request->name) . '-' . mt_rand(100, 999);

        $product = Product::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'short_description' => Str::limit($request->description, 120),
            'category_id' => $request->category_id,
            'brand' => $request->brand ?: 'Ember Edge',
            'price' => $request->price,
            'sale_price' => $request->sale_price,
            'is_featured' => $request->boolean('is_featured'),
            'is_new_arrival' => $request->boolean('is_new_arrival'),
            'status' => $request->status ?: 'active',
            'tags' => ['fashion', 'new'],
        ]);

        if ($request->filled('image_url')) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $request->image_url,
                'is_primary' => true,
                'display_order' => 0,
            ]);
        }

        foreach ($request->variants as $variantData) {
            ProductVariant::create([
                'product_id' => $product->id,
                'sku' => $variantData['sku'],
                'color' => $variantData['color'],
                'size' => $variantData['size'],
                'price' => $variantData['price'] ?? $request->price,
                'sale_price' => $variantData['sale_price'] ?? $request->sale_price,
                'stock_quantity' => $variantData['stock_quantity'],
                'status' => 'active',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load(['images', 'variants']),
        ], 201);
    }

    public function orders(Request $request)
    {
        $orders = Order::with(['user', 'items', 'shipment'])->orderBy('created_at', 'desc')->paginate(15);
        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,returned,refunded',
            'tracking_number' => 'nullable|string',
            'courier_name' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;

        if ($request->status === 'delivered') {
            $order->payment_status = 'completed';
        }

        if ($request->filled('tracking_number')) {
            $order->tracking_number = $request->tracking_number;
        }
        if ($request->filled('courier_name')) {
            $order->courier_name = $request->courier_name;
        }

        $order->save();

        if ($order->shipment) {
            $order->shipment->status = $request->status;
            if ($request->filled('tracking_number')) {
                $order->shipment->tracking_number = $request->tracking_number;
            }
            if ($request->status === 'shipped') {
                $order->shipment->shipped_at = now();
            }
            if ($request->status === 'delivered') {
                $order->shipment->delivered_at = now();
            }
            $order->shipment->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Order status updated to ' . $request->status,
            'data' => $order->load('shipment'),
        ]);
    }
}
