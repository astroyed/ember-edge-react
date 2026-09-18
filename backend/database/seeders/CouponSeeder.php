<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run()
    {
        $coupons = [
            [
                'code' => 'EMBER10',
                'discount_type' => 'percentage',
                'value' => 10.00,
                'min_spend' => 3000.00,
                'max_discount' => 1500.00,
                'usage_limit' => 500,
                'is_active' => true,
            ],
            [
                'code' => 'WELCOME20',
                'discount_type' => 'percentage',
                'value' => 20.00,
                'min_spend' => 5000.00,
                'max_discount' => 3000.00,
                'usage_limit' => 200,
                'is_active' => true,
            ],
            [
                'code' => 'FLAT1000',
                'discount_type' => 'fixed',
                'value' => 1000.00,
                'min_spend' => 8000.00,
                'usage_limit' => 100,
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $c) {
            Coupon::updateOrCreate(['code' => $c['code']], $c);
        }
    }
}
