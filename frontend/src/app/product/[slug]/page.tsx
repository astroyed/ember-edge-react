'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingBag, Ruler, Star, Truck, RefreshCw, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { Product, ProductVariant, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review Submission State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getProductBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          const prod = res.data.product;
          setProduct(prod);
          setRelatedProducts(res.data.related_products || []);

          const primaryImg = prod.images?.find((img: any) => img.is_primary)?.image_path || prod.images?.[0]?.image_path;
          setActiveImage(primaryImg || '');

          // Auto select first color & size variant
          if (prod.variants && prod.variants.length > 0) {
            const firstVariant = prod.variants[0];
            setSelectedColor(firstVariant.color);
            setSelectedSize(firstVariant.size);
            setSelectedVariant(firstVariant);
          }

          // Fetch reviews
          api.getReviews(prod.id).then((rRes) => {
            if (rRes.success) setReviews(rRes.data || []);
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  // Handle color or size selection change
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (!product?.variants) return;
    const matchingVariant = product.variants.find((v) => v.color === color && v.size === selectedSize) ||
      product.variants.find((v) => v.color === color);
    if (matchingVariant) {
      setSelectedSize(matchingVariant.size);
      setSelectedVariant(matchingVariant);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (!product?.variants) return;
    const matchingVariant = product.variants.find((v) => v.color === selectedColor && v.size === size);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a size and color.');
      return;
    }
    if (selectedVariant.stock_quantity < 1) {
      alert('Selected variant is currently out of stock.');
      return;
    }
    addToCart(selectedVariant.id, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review.');
      return;
    }
    if (!product || !newComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await api.submitReview(product.id, {
        rating: newRating,
        comment: newComment.trim(),
      });
      if (res.success && res.data) {
        setReviews((prev) => [res.data, ...prev]);
        setNewComment('');
        alert('Thank you! Your review has been submitted.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-96 bg-zinc-900 border border-zinc-800" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-900 w-3/4" />
            <div className="h-4 bg-zinc-900 w-1/4" />
            <div className="h-24 bg-zinc-900 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase text-white">Product Not Found</h1>
        <Link href="/shop" className="inline-block bg-amber-500 text-black px-6 py-2.5 text-xs font-bold uppercase">
          Back to Shop
        </Link>
      </div>
    );
  }

  const availableColors = Array.from(new Set(product.variants?.map((v) => v.color) || []));
  const availableSizesForColor = product.variants?.filter((v) => v.color === selectedColor).map((v) => v.size) || [];

  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant?.effective_price || product.sale_price || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

      {/* Breadcrumb Navigation */}
      <div className="text-xs text-zinc-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-amber-400">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-amber-400">Shop</Link>
        <span>/</span>
        <span className="text-zinc-200 font-semibold truncate">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Multi-Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-zinc-950 border border-zinc-850 overflow-hidden relative group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_path)}
                  className={`w-20 h-24 border bg-zinc-900 flex-shrink-0 transition-all ${
                    activeImage === img.image_path
                      ? 'border-amber-500 ring-1 ring-amber-500'
                      : 'border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_path} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information & Variant Selector */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-1">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-serif tracking-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex text-amber-400 space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-mono">({reviews.length} Customer Reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 text-xl font-mono font-bold border-y border-zinc-850 py-4">
            {product.sale_price ? (
              <>
                <span className="text-2xl text-amber-400">Rs. {numberFormat(currentPrice)}</span>
                <span className="text-sm text-zinc-500 line-through">Rs. {numberFormat(product.price)}</span>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 uppercase tracking-wider font-sans font-bold">
                  SALE
                </span>
              </>
            ) : (
              <span className="text-2xl text-white">Rs. {numberFormat(currentPrice)}</span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color Swatch Picker */}
          {availableColors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                Select Color: <span className="text-amber-400 font-normal">{selectedColor}</span>
              </label>
              <div className="flex space-x-3">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedColor === color
                        ? 'border-amber-500 bg-amber-500/20 text-amber-400 font-bold'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector with Real-time Stock Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Select Size: <span className="text-amber-400 font-normal">{selectedSize}</span>
              </label>

              {/* Size Guide Trigger */}
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-amber-400 hover:underline flex items-center space-x-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableSizesForColor.map((size) => {
                const variantObj = product.variants?.find((v) => v.color === selectedColor && v.size === size);
                const isOutOfStock = !variantObj || variantObj.stock_quantity <= 0;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => handleSizeChange(size)}
                    className={`px-4 py-2.5 border text-xs font-mono font-bold uppercase transition-all ${
                      isOutOfStock
                        ? 'border-zinc-900 text-zinc-600 line-through cursor-not-allowed bg-zinc-950'
                        : isSelected
                        ? 'border-amber-500 bg-amber-500 text-black font-extrabold'
                        : 'border-zinc-800 text-zinc-300 hover:border-zinc-600 bg-zinc-900'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* SKU and Stock Availability Message */}
            {selectedVariant && (
              <div className="text-xs font-mono pt-1 flex items-center justify-between text-zinc-400">
                <span>SKU: <strong className="text-zinc-200">{selectedVariant.sku}</strong></span>
                {selectedVariant.stock_quantity > 0 ? (
                  <span className="text-green-400 font-semibold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock ({selectedVariant.stock_quantity} available)</span>
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold">Out of Stock</span>
                )}
              </div>
            )}
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-zinc-850">
            <div className="flex space-x-4">
              {/* Quantity Select */}
              <div className="flex items-center border border-zinc-800 bg-zinc-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 text-zinc-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-4 text-xs font-mono font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-3 text-zinc-400 hover:text-white"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
                onClick={handleAddToCart}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black px-6 py-4 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all glow-ember disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              {/* Wishlist Toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 border transition-all ${
                  inWishlist
                    ? 'border-amber-500 bg-amber-500 text-black'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                }`}
                title="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-850 text-[11px] text-zinc-400">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>14-Day Exchanges</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>100% Authentic</span>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="space-y-8 pt-10 border-t border-zinc-850">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">VERIFIED FEEDBACK</span>
            <h2 className="text-2xl font-black uppercase text-white font-serif mt-1">Customer Reviews ({reviews.length})</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Submit Review Form */}
          <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Write a Review</h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs p-2.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>5 Stars - Exceptional</option>
                    <option value={4}>4 Stars - Great Quality</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Expectations</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on fit, material quality, and comfort..."
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs p-3 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-xs px-6 py-3 tracking-wider transition-colors"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p className="text-xs text-zinc-400">
                Please <Link href="/login" className="text-amber-400 font-bold underline">log in</Link> to submit a review for this product.
              </p>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">Be the first to leave a review for this item!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-zinc-900 border border-zinc-850 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white uppercase">{rev.user?.name || 'Verified Customer'}</span>
                    <span className="text-[11px] text-zinc-500">{rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}</span>
                  </div>
                  <div className="flex text-amber-400 space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-zinc-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultTab={product.size_guide_type || 'men'}
      />

    </div>
  );
}

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
