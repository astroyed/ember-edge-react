'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Category, Product } from '@/types';
import { api } from '@/lib/api';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'popular');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success) setCategories(res.data || []);
    });
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (selectedColor) params.color = selectedColor;
      if (selectedSize) params.size = selectedSize;
      if (sortOption) params.sort = sortOption;

      const res = await api.getProducts(params);
      if (res.success) {
        setProducts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, selectedColor, selectedSize, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedColor('');
    setSelectedSize('');
    setSortOption('popular');
    router.push('/shop');
  };

  const colorsList = ['Black', 'White', 'Charcoal', 'Olive', 'Camel', 'Ember Gold', 'Rose Dust', 'Cream'];
  const sizesList = ['XS', 'S', 'M', 'L', 'XL', '4Y', '6Y', '8Y', '30', '32', '34'];

  const activeFilterCount = [selectedCategory, searchQuery, minPrice, maxPrice, selectedColor, selectedSize]
    .filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#eceae4] pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">ATELIER CATALOG</span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-[#1c1c1c] font-serif mt-1">
            {selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'ALL PRODUCTS'}
          </h1>
          {searchQuery && (
            <p className="text-xs text-[#5f5f5d] mt-1">
              Showing search results for "<span className="text-[#e58a2b] font-semibold">{searchQuery}</span>"
            </p>
          )}
        </div>

        {/* Filter Controls & Sort */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden bg-[#1c1c1c] border border-[#1c1c1c] text-[#fcfbf8] px-4 py-2 text-xs font-black uppercase flex items-center space-x-2 rounded-full inset-shadow-btn hover:brightness-90 transition-all"
          >
            <Filter className="w-4 h-4 text-[#e58a2b]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#e58a2b] text-[#1c1c1c] text-[10px] px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-2 bg-[#f7f4ed] border border-[#eceae4] px-3 py-2 text-xs rounded-full">
            <span className="text-[#5f5f5d] uppercase font-semibold hidden sm:inline">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-[#1c1c1c] font-bold focus:outline-none cursor-pointer"
            >
              <option value="popular">Featured & Popular</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block space-y-6 bg-[#f7f4ed] border border-[#eceae4] p-6 h-fit sticky top-28">
          <div className="flex items-center justify-between border-b border-[#eceae4] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#e58a2b]" />
              <span>Refine Catalog</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#5f5f5d] hover:text-[#e58a2b] flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider">Category</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left px-2 py-1.5 rounded-full transition-colors ${
                  selectedCategory === '' ? 'bg-[#1c1c1c] text-[#fcfbf8] font-bold' : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#5f5f5d]/5'
                }}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left px-2 py-1.5 rounded-full transition-colors ${
                    selectedCategory === cat.slug ? 'bg-[#1c1c1c] text-[#fcfbf8] font-bold' : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#5f5f5d]/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-4 border-t border-[#eceae4]">
            <h4 className="text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider">Price Range (PKR)</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-[#f7f4ed]/50 border border-[#eceae4] text-xs p-2 text-[#1c1c1c] placeholder-[#5f5f5d]/60 focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-[#f7f4ed]/50 border border-[#eceae4] text-xs p-2 text-[#1c1c1c] placeholder-[#5f5f5d]/60 focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2 pt-4 border-t border-[#eceae4]">
            <h4 className="text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider">Color</h4>
            <div className="flex flex-wrap gap-1.5">
              {colorsList.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                  className={`text-[11px] px-2.5 py-1 border rounded-full transition-colors ${
                    selectedColor === color
                      ? 'border-[#e58a2b] bg-[#e58a2b]/10 text-[#e58a2b] font-bold'
                      : 'border-[#eceae4] text-[#5f5f5d] hover:border-[#e58a2b]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-4 border-t border-[#eceae4]">
            <h4 className="text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              {sizesList.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`text-[11px] px-3 py-1 border rounded-full transition-colors font-mono ${
                    selectedSize === size
                      ? 'border-[#1c1c1c] bg-[#1c1c1c] text-[#fcfbf8] font-bold'
                      : 'border-[#eceae4] text-[#5f5f5d] hover:border-[#1c1c1c]'
                  }}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-[#5f5f5d]/10 border border-[#eceae4] rounded-xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#f7f4ed] border border-[#eceae4] rounded-xl space-y-4">
              <p className="text-sm text-[#5f5f5d]">No products found matching your filter criteria.</p>
              <button
                onClick={handleResetFilters}
                className="bg-[#1c1c1c] text-[#fcfbf8] px-6 py-2.5 text-xs font-black uppercase tracking-wider inset-shadow-btn hover:brightness-90 transition-all glow-focus"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#5f5f5d]">Loading shop catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
