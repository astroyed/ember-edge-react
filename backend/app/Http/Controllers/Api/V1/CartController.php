<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    private function getOrCreateCart(Request $request): Cart
    {
        if (Auth::guard('sanctum')->check()) {
            $user = Auth::guard('sanctum')->user();
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        $sessionId = $request->header('X-Session-ID') ?: $request->get('session_id') ?: 'guest_'.session()->getId();
        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    public function index(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load(['items.variant.product.images']);

        $totalSubtotal = 0;
        $itemsFormatted = $cart->items->map(function ($item) use (&$totalSubtotal) {
            $variant = $item->variant;
            $product = $variant ? $variant->product : null;
            $unitPrice = $variant ? $variant->effective_price : 0;
            $subtotal = $unitPrice * $item->quantity;
            $totalSubtotal += $subtotal;

            return [
                'id' => $item->id,
                'product_variant_id' => $item->product_variant_id,
                'quantity' => $item->quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
                'variant' => [
                    'id' => $variant->id ?? null,
                    'sku' => $variant->sku ?? '',
                    'color' => $variant->color ?? '',
                    'size' => $variant->size ?? '',
                    'stock_quantity' => $variant->stock_quantity ?? 0,
                ],
                'product' => [
                    'id' => $product->id ?? null,
                    'name' => $product->name ?? 'Unknown Product',
                    'slug' => $product->slug ?? '',
                    'brand' => $product->brand ?? '',
                    'image' => $product->images->where('is_primary', true)->first()->image_path ?? $product->images->first()->image_path ?? null,
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'cart_id' => $cart->id,
                'items' => $itemsFormatted,
                'subtotal' => $totalSubtotal,
                'item_count' => $cart->items->sum('quantity'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getOrCreateCart($request);
        $variant = ProductVariant::findOrFail($request->product_variant_id);

        if ($variant->stock_quantity < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Requested quantity exceeds available stock (' . $variant->stock_quantity . ' available).',
            ], 422);
        }

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_variant_id', $variant->id)
            ->first();

        if ($item) {
            $newQuantity = $item->quantity + $request->quantity;
            if ($variant->stock_quantity < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot add more items. Total stock is ' . $variant->stock_quantity . '.',
                ], 422);
            }
            $item->quantity = $newQuantity;
            $item->save();
        } else {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_variant_id' => $variant->id,
                'quantity' => $request->quantity,
            ]);
        }

        return $this->index($request);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getOrCreateCart($request);
        $item = CartItem::where('cart_id', $cart->id)->where('id', $id)->firstOrFail();
        $variant = $item->variant;

        if ($variant && $variant->stock_quantity < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Requested quantity exceeds stock quantity (' . $variant->stock_quantity . ' left).',
            ], 422);
        }

        $item->quantity = $request->quantity;
        $item->save();

        return $this->index($request);
    }

    public function destroy(Request $request, $id)
    {
        $cart = $this->getOrCreateCart($request);
        CartItem::where('cart_id', $cart->id)->where('id', $id)->delete();

        return $this->index($request);
    }

    public function clear(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        CartItem::where('cart_id', $cart->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared',
        ]);
    }
}
