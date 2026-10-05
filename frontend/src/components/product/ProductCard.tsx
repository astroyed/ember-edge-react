'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_path ||
    product.images?.[0]?.image_path ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600';

  const hoverImage =
    product.images?.[1]?.image_path || primaryImage;

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100)
    : 0;

  const availableColors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean) || [])
  );

  return (
    <div className="group relative bg-[#f7f4ed] border border-[#eceae4] hover:border-[#5f5f5d]/50 transition-all duration-300 flex flex-col justify-between">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1.5">
        {hasDiscount && (
          <span className="bg-[#5f5f5d] text-[#fcfbf8] text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
            -{discountPercent}% OFF
          </span>
        )}
        {product.is_new_arrival && (
          <span className="bg-[#1c1c1c] text-[#fcfbf8] text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
            NEW
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          inWishlist
            ? 'bg-[#e58a2b] text-[#1c1c1c]'
            : 'bg-[#1c1c1c]/60 text-[#fcfbf8] hover:bg-[#e58a2b] hover:text-[#1c1c1c]'
        }`}
        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      {/* Product Image Gallery Preview */}
      <Link href={`/product/${product.slug}`} className="block overflow-hidden aspect-[3/4] relative bg-[#5f5f5d]/5">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 opacity-100 transition-all duration-500 absolute inset-0"
        />
        <img
          src={hoverImage}
          alt={`${product.name} hover view`}
          className="w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 absolute inset-0"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#e58a2b] block mb-1">
            {product.brand || 'EMBER EDGE'}
          </span>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs font-semibold text-[#1c1c1c] group-hover:text-[#e58a2b] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Color Swatch Preview */}
        {availableColors.length > 0 && (
          <div className="flex items-center space-x-1.5 pt-1">
            {availableColors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                title={color}
                className="w-2.5 h-2.5 rounded-full border border-[#5f5f5d]/30 inline-block"
                style={{
                  backgroundColor:
                    color.toLowerCase().includes('black') ? '#1c1c1c' :
                    color.toLowerCase().includes('white') ? '#fcfbf8' :
                    color.toLowerCase().includes('gold') ? '#d97706' :
                    color.toLowerCase().includes('charcoal') ? '#3f3f46' :
                    color.toLowerCase().includes('olive') ? '#4d7c0f' : '#71717a'
                }}
              />
            ))}
            {availableColors.length > 4 && (
              <span className="text-[9px] text-[#5f5f5d] font-mono">+{availableColors.length - 4}</span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 pt-1 border-t border-[#eceae4]">
          {hasDiscount ? (
            <>
              <span className="text-sm font-bold text-[#e58a2b] font-mono">
                Rs. {numberFormat(product.sale_price!)}
              </span>
              <span className="text-xs text-[#5f5f5d] line-through font-mono">
                Rs. {numberFormat(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#1c1c1c] font-mono">
              Rs. {numberFormat(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
