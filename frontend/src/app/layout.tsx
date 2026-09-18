import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Ember Edge | Luxury Fashion & Modern Atelier',
  description: 'Shop luxury streetwear, tailored outerwear, and contemporary essentials from Ember Edge. Crafted from 280 GSM premium combed cotton and virgin wool.',
  keywords: ['Ember Edge', 'fashion', 'clothing brand', 'streetwear', 'luxury outerwear', 'men apparel', 'women couture', 'kids clothing'],
  openGraph: {
    title: 'Ember Edge | Luxury Fashion Brand',
    description: 'Minimalist luxury apparel and architectural outerwear designed for modern living.',
    url: 'https://emberedge.com',
    siteName: 'Ember Edge',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Ember Edge Campaign',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0B0C] text-zinc-100 min-h-screen flex flex-col font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
