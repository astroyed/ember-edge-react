<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    private function getOrCreateWishlist(Request $request): Wishlist
    {
        if (Auth::guard('sanctum')->check()) {
            $user = Auth::guard('sanctum')->user();
            return Wishlist::firstOrCreate(['user_id' => $user->id]);
        }

        $sessionId = $request->header('X-Session-ID') ?: $request->get('session_id') ?: 'guest_'.session()->getId();
        return Wishlist::firstOrCreate(['session_id' => $sessionId]);
    }

    public function index(Request $request)
    {
        $wishlist = $this->getOrCreateWishlist($request);
        $wishlist->load(['items.product.images', 'items.product.variants']);

        $items = $wishlist->items->map(function ($item) {
            return $item->product;
        })->filter();

        return response()->json([
            'success' => true,
            'data' => $items->values(),
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $wishlist = $this->getOrCreateWishlist($request);
        $existing = WishlistItem::where('wishlist_id', $wishlist->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->delete();
            $added = false;
            $message = 'Product removed from wishlist';
        } else {
            WishlistItem::create([
                'wishlist_id' => $wishlist->id,
                'product_id' => $request->product_id,
            ]);
            $added = true;
            $message = 'Product added to wishlist';
        }

        return response()->json([
            'success' => true,
            'added' => $added,
            'message' => $message,
        ]);
    }
}
