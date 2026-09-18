<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => "Men's Collection",
                'slug' => 'men',
                'description' => 'Luxury streetwear, tailored outerwear & minimalist tops for modern men.',
                'image' => 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop',
                'display_order' => 1,
            ],
            [
                'name' => "Women's Collection",
                'slug' => 'women',
                'description' => 'Contemporary silhouettes, elegant dresses & premium knitwear.',
                'image' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
                'display_order' => 2,
            ],
            [
                'name' => "Kids Collection",
                'slug' => 'kids',
                'description' => 'Comfortable, stylish & durable essential clothing for kids.',
                'image' => 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop',
                'display_order' => 3,
            ],
            [
                'name' => 'Outerwear & Jackets',
                'slug' => 'outerwear',
                'description' => 'Heavyweight coats, bomber jackets & signature leather pieces.',
                'image' => 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
                'display_order' => 4,
            ],
            [
                'name' => 'Accessories & Leatherware',
                'slug' => 'accessories',
                'description' => 'Ember Edge signature belts, scarves, bags & caps.',
                'image' => 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?q=80&w=1000&auto=format&fit=crop',
                'display_order' => 5,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
