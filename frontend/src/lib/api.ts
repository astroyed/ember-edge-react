const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sid = localStorage.getItem('ember_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('ember_session_id', sid);
  }
  return sid;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ember_token');
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const sessionId = getSessionId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Session-ID': sessionId,
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API request failed with status ${res.status}`);
  }

  return data;
}

// Helper methods for catalog & system
export const api = {
  getProducts: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi<any>(`/products?${query}`);
  },
  getProductBySlug: (slug: string) => fetchApi<any>(`/products/${slug}`),
  getFeaturedProducts: () => fetchApi<any>('/products/featured'),
  getNewArrivals: () => fetchApi<any>('/products/new-arrivals'),
  getCategories: () => fetchApi<any>('/categories'),
  getCategoryBySlug: (slug: string) => fetchApi<any>(`/categories/${slug}`),

  // Cart
  getCart: () => fetchApi<any>('/cart'),
  addToCart: (productVariantId: number, quantity: number = 1) =>
    fetchApi<any>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_variant_id: productVariantId, quantity }),
    }),
  updateCartItem: (itemId: number, quantity: number) =>
    fetchApi<any>(`/cart/update/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (itemId: number) =>
    fetchApi<any>(`/cart/remove/${itemId}`, { method: 'DELETE' }),
  clearCart: () => fetchApi<any>('/cart/clear', { method: 'POST' }),

  // Wishlist
  getWishlist: () => fetchApi<any>('/wishlist'),
  toggleWishlist: (productId: number) =>
    fetchApi<any>('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }),

  // Checkout & Coupon
  validateCoupon: (code: string, subtotal: number) =>
    fetchApi<any>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),
  processCheckout: (checkoutData: any) =>
    fetchApi<any>('/checkout/process', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),

  // Orders
  getMyOrders: () => fetchApi<any>('/orders/my-orders'),
  getOrder: (orderNumber: string) => fetchApi<any>(`/orders/${orderNumber}`),
  trackOrder: (trackingNumber: string) => fetchApi<any>(`/orders/track/${trackingNumber}`),

  // Auth
  register: (data: any) => fetchApi<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => fetchApi<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchApi<any>('/auth/logout', { method: 'POST' }),
  getUserProfile: () => fetchApi<any>('/auth/user'),
  updateProfile: (data: any) => fetchApi<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Banners & Reviews
  getBanners: () => fetchApi<any>('/banners'),
  getReviews: (productId: number) => fetchApi<any>(`/products/${productId}/reviews`),
  submitReview: (productId: number, data: { rating: number; comment: string }) =>
    fetchApi<any>(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),

  // Admin Panel API
  getAdminStats: () => fetchApi<any>('/admin/dashboard-stats'),
  getAdminProducts: () => fetchApi<any>('/admin/products'),
  createAdminProduct: (productData: any) => fetchApi<any>('/admin/products', { method: 'POST', body: JSON.stringify(productData) }),
  getAdminOrders: () => fetchApi<any>('/admin/orders'),
  updateAdminOrderStatus: (id: number, status: string, trackingNumber?: string) =>
    fetchApi<any>(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, tracking_number: trackingNumber }) }),
};
