<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        $orderStats = Order::query()
            ->selectRaw(
                'COUNT(*) as total_orders, COALESCE(SUM(CASE WHEN payment_status = ? THEN total_amount ELSE 0 END), 0) as total_revenue, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending_orders',
                ['completed', 'pending']
            )
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue' => $orderStats->total_revenue,
                'total_orders' => $orderStats->total_orders,
                'pending_orders' => $orderStats->pending_orders,
                'total_products' => Product::count(),
            ]
        ]);
    }

    public function products(Request $request)
    {
        $products = Product::query()
            ->select([
                'id', 'name', 'slug', 'description', 'short_description', 'category_id',
                'brand', 'price', 'sale_price', 'is_featured', 'is_new_arrival', 'status', 'tags', 'created_at',
            ])
            ->with([
                'category:id,name,slug',
                'variants:id,product_id,color,size,stock_quantity',
                'images',
            ])
            ->orderByDesc('created_at')
            ->simplePaginate(15);
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
            'image' => 'required|image|max:10240',
            'variants' => 'required|array|min:1',
            'variants.*.color' => 'required|string',
            'variants.*.size' => 'required|string',
            'variants.*.sku' => 'required|string|unique:product_variants,sku',
            'variants.*.stock_quantity' => 'required|integer|min:0',
        ]);

        $category = Category::findOrFail($request->category_id);
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

        if ($request->hasFile('image')) {
            $fileName = $this->storeProductImage($request->file('image'), $category, $product);

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $fileName,
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

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
        ]);

        $product->fill([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'sale_price' => $validated['sale_price'] ?? null,
            'description' => $validated['description'] ?? null,
            'short_description' => Str::limit($validated['description'] ?? '', 120),
        ]);
        $product->save();

        if ($request->hasFile('image')) {
            $category = Category::findOrFail($product->category_id);
            $fileName = $this->storeProductImage($request->file('image'), $category, $product);
            $primaryImage = $product->primaryImage()->first();
            $oldImagePath = $primaryImage?->getRawOriginal('image_path');

            if ($primaryImage) {
                $primaryImage->image_path = $fileName;
                $primaryImage->save();
            } else {
                $product->images()->create([
                    'image_path' => $fileName,
                    'is_primary' => true,
                    'display_order' => 0,
                ]);
            }

            if ($oldImagePath && !filter_var($oldImagePath, FILTER_VALIDATE_URL) && !str_starts_with($oldImagePath, '/')) {
                Storage::disk('public')->delete('products/' . basename($oldImagePath));
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product->load(['category', 'images', 'variants']),
        ]);
    }

    public function deleteProduct($id)
    {
        $product = Product::with('images')->findOrFail($id);
        $imagePaths = $product->images
            ->map(fn (ProductImage $image) => $image->getRawOriginal('image_path'));

        $product->delete();

        foreach ($imagePaths as $imagePath) {
            if ($imagePath && !filter_var($imagePath, FILTER_VALIDATE_URL) && !str_starts_with($imagePath, '/')) {
                Storage::disk('public')->delete('products/' . basename($imagePath));
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }

    private function storeProductImage(UploadedFile $image, Category $category, Product $product): string
    {
        $baseName = 'ee-' . (Str::slug($category->name) ?: 'category') . '-' . (Str::slug($product->name) ?: 'product');
        $extension = $image->extension();
        $fileName = $baseName . '.' . $extension;
        $suffix = 2;

        while (Storage::disk('public')->exists('products/' . $fileName)) {
            $fileName = $baseName . '-' . $suffix . '.' . $extension;
            $suffix++;
        }

        $image->storeAs('products', $fileName, 'public');

        return $fileName;
    }

    public function orders(Request $request)
    {
        $orders = Order::query()
            ->select([
                'id', 'order_number', 'user_id', 'shipping_address', 'guest_email', 'status',
                'payment_method', 'payment_status', 'total_amount', 'tracking_number', 'created_at',
            ])
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->simplePaginate(15);
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
