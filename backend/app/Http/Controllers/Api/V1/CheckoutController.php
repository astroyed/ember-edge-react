<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',

            // Address fields
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string',
            'shipping_address.last_name' => 'required|string',
            'shipping_address.email' => 'required|email',
            'shipping_address.phone' => 'required|string',
            'shipping_address.address_line_1' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.postal_code' => 'required|string',

            'billing_address' => 'nullable|array',
            'payment_method' => 'required|string|in:cod,stripe,jazzcash,easypaisa,bank_transfer',
            'coupon_code' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::guard('sanctum')->user();
        $guestEmail = $user ? null : $request->shipping_address['email'];

        try {
            return DB::transaction(function () use ($request, $user, $guestEmail) {
                $subtotal = 0;
                $orderItemsData = [];

                foreach ($request->items as $item) {
                    $variant = ProductVariant::with('product')->findOrFail($item['product_variant_id']);

                    if ($variant->stock_quantity < $item['quantity']) {
                        throw new \Exception("Stock limit exceeded for {$variant->product->name} ({$variant->color} / {$variant->size}). Only {$variant->stock_quantity} left.");
                    }

                    $unitPrice = $variant->effective_price;
                    $itemSubtotal = $unitPrice * $item['quantity'];
                    $subtotal += $itemSubtotal;

                    // Deduct stock
                    $variant->decrement('stock_quantity', $item['quantity']);

                    $orderItemsData[] = [
                        'product_id' => $variant->product_id,
                        'product_variant_id' => $variant->id,
                        'product_name' => $variant->product->name,
                        'variant_sku' => $variant->sku,
                        'color' => $variant->color,
                        'size' => $variant->size,
                        'unit_price' => $unitPrice,
                        'quantity' => $item['quantity'],
                        'subtotal' => $itemSubtotal,
                    ];
                }

                // Coupon calculation
                $discountAmount = 0;
                $couponId = null;
                if ($request->filled('coupon_code')) {
                    $coupon = Coupon::where('code', strtoupper($request->coupon_code))->where('is_active', true)->first();
                    if ($coupon && $coupon->isValidForAmount($subtotal)) {
                        $discountAmount = $coupon->calculateDiscount($subtotal);
                        $couponId = $coupon->id;
                        $coupon->increment('usage_count');
                    }
                }

                $shippingFee = $subtotal > 5000 ? 0 : 250; // Free shipping above Rs. 5000
                $taxAmount = 0;
                $totalAmount = max(0, $subtotal - $discountAmount + $shippingFee + $taxAmount);

                $orderNumber = 'EE-' . strtoupper(Str::random(3)) . '-' . mt_rand(100000, 999999);
                $trackingNumber = 'TRK-' . mt_rand(10000000, 99999999);

                $order = Order::create([
                    'order_number' => $orderNumber,
                    'user_id' => $user ? $user->id : null,
                    'guest_email' => $guestEmail,
                    'status' => 'pending',
                    'subtotal' => $subtotal,
                    'discount_amount' => $discountAmount,
                    'shipping_fee' => $shippingFee,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                    'coupon_id' => $couponId,
                    'shipping_address' => $request->shipping_address,
                    'billing_address' => $request->billing_address ?: $request->shipping_address,
                    'payment_method' => $request->payment_method,
                    'payment_status' => $request->payment_method === 'cod' ? 'pending' : 'completed',
                    'tracking_number' => $trackingNumber,
                    'courier_name' => 'Ember Express Express Courier',
                    'notes' => $request->notes,
                ]);

                foreach ($orderItemsData as $itemData) {
                    $itemData['order_id'] = $order->id;
                    OrderItem::create($itemData);
                }

                // Create Payment record
                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => $request->payment_method,
                    'transaction_id' => 'TXN-' . strtoupper(Str::random(10)),
                    'amount' => $totalAmount,
                    'currency' => 'PKR',
                    'status' => $request->payment_method === 'cod' ? 'pending' : 'completed',
                    'payload' => [
                        'gateway' => $request->payment_method,
                        'timestamp' => now()->toIso8601String(),
                    ]
                ]);

                // Create Shipment record
                Shipment::create([
                    'order_id' => $order->id,
                    'tracking_number' => $trackingNumber,
                    'carrier' => 'Ember Logistics',
                    'status' => 'label_created',
                    'estimated_delivery' => now()->addDays(3),
                ]);

                // Clear cart if user or session exists
                if ($user) {
                    $cart = Cart::where('user_id', $user->id)->first();
                    if ($cart) {
                        $cart->items()->delete();
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Order placed successfully!',
                    'data' => [
                        'order' => $order->load(['items', 'shipment']),
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
