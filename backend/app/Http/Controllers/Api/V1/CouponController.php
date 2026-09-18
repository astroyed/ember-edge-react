<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper(trim($request->code)))
            ->where('is_active', true)
            ->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired coupon code.',
            ], 422);
        }

        if (!$coupon->isValidForAmount($request->subtotal)) {
            $msg = 'Coupon requirements not met.';
            if ($request->subtotal < $coupon->min_spend) {
                $msg = 'Minimum order spend of Rs. ' . number_format($coupon->min_spend) . ' required for this coupon.';
            }
            return response()->json([
                'success' => false,
                'message' => $msg,
            ], 422);
        }

        $discount = $coupon->calculateDiscount($request->subtotal);

        return response()->json([
            'success' => true,
            'message' => 'Coupon applied successfully!',
            'data' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'discount_type' => $coupon->discount_type,
                'value' => $coupon->value,
                'discount_amount' => $discount,
            ]
        ]);
    }
}
