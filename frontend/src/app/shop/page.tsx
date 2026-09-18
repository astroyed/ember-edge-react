'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, X, ChevronDown, RefreshCw } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">ATELIER CATALOG</span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-serif mt-1">
            {selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'ALL PRODUCTS'}
          </h1>
          {searchQuery && (
            <p className="text-xs text-zinc-400 mt-1">
              Showing search results for "<span className="text-amber-400 font-semibold">{searchQuery}</span>"
            </p>
          )}
        </div>

        {/* Filter Controls & Sort */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden bg-zinc-900 border border-zinc-800 text-white px-4 py-2 text-xs font-bold uppercase flex items-center space-x-2"
          >
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs">
            <span className="text-zinc-400 uppercase font-semibold hidden sm:inline">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-white font-bold uppercase focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-zinc-900">Featured & Popular</option>
              <option value="newest" className="bg-zinc-900">Newest Arrivals</option>
              <option value="price_asc" className="bg-zinc-900">Price: Low to High</option>
              <option value="price_desc" className="bg-zinc-900">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block space-y-6 bg-zinc-950 border border-zinc-850 p-6 h-fit sticky top-28">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Refine Catalog</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-zinc-500 hover:text-amber-400 flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Category</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left px-2 py-1.5 transition-colors ${
                  selectedCategory === '' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left px-2 py-1.5 transition-colors ${
                    selectedCategory === cat.slug ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-4 border-t border-zinc-850">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Price Range (PKR)</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs p-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs p-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2 pt-4 border-t border-zinc-850">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Color</h4>
            <div className="flex flex-wrap gap-1.5">
              {colorsList.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                  className={`text-[11px] px-2.5 py-1 border transition-colors ${
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

          {/* Size Filter */}
          <div className="space-y-2 pt-4 border-t border-zinc-850">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              {sizesList.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`text-[11px] px-3 py-1 border transition-colors font-mono ${
                    selectedSize === size
                      ? 'border-amber-500 bg-amber-500 text-black font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
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
                <div key={i} className="h-80 bg-zinc-900 border border-zinc-850" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-zinc-950 border border-zinc-850 space-y-4">
              <p className="text-sm text-zinc-400">No products found matching your filter criteria.</p>
              <button
                onClick={handleResetFilters}
                className="bg-amber-500 text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
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
    <Suspense fallback={<div className="text-center py-20 text-zinc-400">Loading shop catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
