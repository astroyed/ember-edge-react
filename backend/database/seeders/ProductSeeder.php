<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $menCat = Category::where('slug', 'men')->first();
        $womenCat = Category::where('slug', 'women')->first();
        $kidsCat = Category::where('slug', 'kids')->first();
        $outerwearCat = Category::where('slug', 'outerwear')->first();
        $accessoriesCat = Category::where('slug', 'accessories')->first();

        $productsData = [
            [
                'name' => 'Signature Oversized Heavyweight Tee',
                'slug' => 'signature-oversized-heavyweight-tee',
                'category_id' => $menCat->id,
                'description' => 'Crafted from 280 GSM luxury combed cotton, our Signature Oversized Heavyweight Tee provides a structural silhouette with unmatched comfort. Drop shoulders, ribbed collar, and Ember Edge emblem tone-on-tone embroidery.',
                'short_description' => '280 GSM heavyweight combed cotton tee with drop shoulder silhouette.',
                'brand' => 'Ember Edge',
                'price' => 4500.00,
                'sale_price' => 3900.00,
                'is_featured' => true,
                'is_new_arrival' => true,
                'status' => 'active',
                'size_guide_type' => 'men',
                'tags' => ['tee', 'oversized', 'streetwear', 'cotton'],
                'images' => [
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Black', 'Ember Gold', 'White'],
                'sizes' => ['S', 'M', 'L', 'XL'],
            ],
            [
                'name' => 'Tailored Italian Wool Trench Coat',
                'slug' => 'tailored-italian-wool-trench-coat',
                'category_id' => $outerwearCat->id,
                'description' => 'An architectural outerwear masterpiece crafted from Italian virgin wool blend. Features sharp lapels, double-breasted button closure, storm flap, and a detachable waist tie belt.',
                'short_description' => 'Architectural double-breasted trench coat in virgin wool blend.',
                'brand' => 'Ember Edge Atelier',
                'price' => 18500.00,
                'sale_price' => 15900.00,
                'is_featured' => true,
                'is_new_arrival' => false,
                'status' => 'active',
                'size_guide_type' => 'men',
                'tags' => ['coat', 'wool', 'trench', 'outerwear', 'luxury'],
                'images' => [
                    'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Charcoal', 'Camel'],
                'sizes' => ['M', 'L', 'XL'],
            ],
            [
                'name' => 'Monochrome Silk Evening Dress',
                'slug' => 'monochrome-silk-evening-dress',
                'category_id' => $womenCat->id,
                'description' => 'Flowing mulberry silk draped flawlessly for effortless elegance. Bias-cut silhouette with delicate thin straps, cowled neckline, and an ankle-length hemline.',
                'short_description' => 'Pure mulberry silk bias-cut dress with elegant cowled neckline.',
                'brand' => 'Ember Edge Couture',
                'price' => 12900.00,
                'sale_price' => 10500.00,
                'is_featured' => true,
                'is_new_arrival' => true,
                'status' => 'active',
                'size_guide_type' => 'women',
                'tags' => ['dress', 'silk', 'evening', 'women', 'luxury'],
                'images' => [
                    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Black', 'Cream'],
                'sizes' => ['XS', 'S', 'M', 'L'],
            ],
            [
                'name' => 'Structured Power Blazer',
                'slug' => 'structured-power-blazer',
                'category_id' => $womenCat->id,
                'description' => 'Tailored to perfection with padded shoulders, peak lapels, and custom ember-embossed brass buttons. Flattering modern silhouette for corporate & evening wear.',
                'short_description' => 'Structured blazer with padded shoulders and custom brass buttons.',
                'brand' => 'Ember Edge',
                'price' => 14500.00,
                'sale_price' => 12900.00,
                'is_featured' => false,
                'is_new_arrival' => true,
                'status' => 'active',
                'size_guide_type' => 'women',
                'tags' => ['blazer', 'tailored', 'suiting', 'women'],
                'images' => [
                    'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Obsidian Black', 'Rose Dust'],
                'sizes' => ['S', 'M', 'L'],
            ],
            [
                'name' => 'Junior Ember Fleece Hoodie',
                'slug' => 'junior-ember-fleece-hoodie',
                'category_id' => $kidsCat->id,
                'description' => 'Ultra-soft organic cotton fleece hoodie tailored for active kids. Double-lined hood, kangaroo front pocket, and durable ribbed cuffs.',
                'short_description' => 'Organic cotton fleece kids hoodie with kangaroo pocket.',
                'brand' => 'Ember Kids',
                'price' => 3500.00,
                'sale_price' => 2900.00,
                'is_featured' => true,
                'is_new_arrival' => true,
                'status' => 'active',
                'size_guide_type' => 'kids',
                'tags' => ['kids', 'hoodie', 'fleece', 'cotton'],
                'images' => [
                    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Ember Orange', 'Slate Grey', 'Navy'],
                'sizes' => ['4Y', '6Y', '8Y', '10Y', '12Y'],
            ],
            [
                'name' => 'Tactical Heavyweight Cargo Pants',
                'slug' => 'tactical-heavyweight-cargo-pants',
                'category_id' => $menCat->id,
                'description' => 'Utility-meets-luxury cargo pants made from durable cotton twill. Multi-pocket design, adjustable ankle drawstrings, and reinforced knee paneling.',
                'short_description' => 'Durable twill cargo pants with utility pockets and ankle drawstrings.',
                'brand' => 'Ember Edge',
                'price' => 6900.00,
                'sale_price' => 5900.00,
                'is_featured' => false,
                'is_new_arrival' => false,
                'status' => 'active',
                'size_guide_type' => 'men',
                'tags' => ['cargo', 'pants', 'trousers', 'men', 'utility'],
                'images' => [
                    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Olive', 'Pitch Black'],
                'sizes' => ['30', '32', '34', '36'],
            ],
            [
                'name' => 'Ribbed Wool-Cashmere Cropped Knit',
                'slug' => 'ribbed-wool-cashmere-cropped-knit',
                'category_id' => $womenCat->id,
                'description' => 'Luxurious wool and cashmere blend sweater featuring ribbed texturing, mock neckline, and a flattering relaxed crop drape.',
                'short_description' => 'Soft wool-cashmere blend cropped knit sweater.',
                'brand' => 'Ember Edge',
                'price' => 5500.00,
                'sale_price' => 4500.00,
                'is_featured' => true,
                'is_new_arrival' => false,
                'status' => 'active',
                'size_guide_type' => 'women',
                'tags' => ['knitwear', 'cashmere', 'sweater', 'women'],
                'images' => [
                    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Forest Green', 'Sand', 'Off-White'],
                'sizes' => ['S', 'M', 'L'],
            ],
            [
                'name' => 'Grain Leather Crossbody Camera Bag',
                'slug' => 'grain-leather-crossbody-camera-bag',
                'category_id' => $accessoriesCat->id,
                'description' => 'Full-grain Italian calf leather crossbody bag featuring magnetic flap closure, adjustable strap, suede interior lining, and custom gunmetal hardware.',
                'short_description' => 'Full-grain Italian calf leather crossbody bag with gunmetal hardware.',
                'brand' => 'Ember Edge Leatherware',
                'price' => 8900.00,
                'sale_price' => 7500.00,
                'is_featured' => true,
                'is_new_arrival' => true,
                'status' => 'active',
                'size_guide_type' => null,
                'tags' => ['bag', 'leather', 'accessories', 'crossbody'],
                'images' => [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
                ],
                'colors' => ['Chestnut Brown', 'Jet Black'],
                'sizes' => ['One Size'],
            ],
        ];

        foreach ($productsData as $pData) {
            $product = Product::updateOrCreate(
                ['slug' => $pData['slug']],
                [
                    'name' => $pData['name'],
                    'category_id' => $pData['category_id'],
                    'description' => $pData['description'],
                    'short_description' => $pData['short_description'],
                    'brand' => $pData['brand'],
                    'price' => $pData['price'],
                    'sale_price' => $pData['sale_price'],
                    'is_featured' => $pData['is_featured'],
                    'is_new_arrival' => $pData['is_new_arrival'],
                    'status' => $pData['status'],
                    'size_guide_type' => $pData['size_guide_type'],
                    'tags' => $pData['tags'],
                ]
            );

            // Images
            foreach ($pData['images'] as $idx => $imgUrl) {
                ProductImage::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'image_path' => $imgUrl,
                    ],
                    [
                        'is_primary' => $idx === 0,
                        'display_order' => $idx,
                    ]
                );
            }

            // Variants (Color + Size matrix)
            foreach ($pData['colors'] as $color) {
                foreach ($pData['sizes'] as $size) {
                    $colorSlug = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $color), 0, 3));
                    $sizeSlug = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $size));
                    $sku = strtoupper(substr($product->slug, 0, 4)) . '-' . $colorSlug . '-' . $sizeSlug;

                    ProductVariant::updateOrCreate(
                        ['sku' => $sku],
                        [
                            'product_id' => $product->id,
                            'color' => $color,
                            'size' => $size,
                            'price' => $product->price,
                            'sale_price' => $product->sale_price,
                            'stock_quantity' => rand(8, 45),
                            'status' => 'active',
                        ]
                    );
                }
            }
        }
    }
}
