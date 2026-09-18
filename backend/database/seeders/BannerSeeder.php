<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run()
    {
        $banners = [
            [
                'title' => 'AUTUMN / WINTER 2026',
                'subtitle' => 'Architectural Silhouettes & Heavyweight Luxury Outerwear.',
                'image_path' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
                'button_text' => 'Explore Collection',
                'button_url' => '/shop',
                'position' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'THE OVERSIZED ESSENTIALS',
                'subtitle' => 'Crafted from 280 GSM luxury combed cotton with drop-shoulder precision.',
                'image_path' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
                'button_text' => 'Shop Men',
                'button_url' => '/collections/men',
                'position' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'ELEGANCE IN MONOCHROME',
                'subtitle' => 'Bias-cut mulberry silk gowns & structured wool suiting for modern women.',
                'image_path' => 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
                'button_text' => 'Shop Women',
                'button_url' => '/collections/women',
                'position' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($banners as $b) {
            Banner::updateOrCreate(['title' => $b['title']], $b);
        }
    }
}
