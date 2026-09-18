<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BannerController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\CouponController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Ember Edge REST API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::get('/auth/addresses', [AuthController::class, 'getAddresses']);
        Route::post('/auth/addresses', [AuthController::class, 'storeAddress']);

        // Authenticated Customer Orders
        Route::get('/orders/my-orders', [OrderController::class, 'userOrders']);
    });

    // Catalog Routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/new-arrivals', [ProductController::class, 'newArrivals']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    // Reviews
    Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);
    Route::middleware('auth:sanctum')->post('/products/{id}/reviews', [ReviewController::class, 'store']);

    // Cart (Supports Guest + Auth)
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'store']);
    Route::put('/cart/update/{id}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'destroy']);
    Route::post('/cart/clear', [CartController::class, 'clear']);

    // Wishlist (Supports Guest + Auth)
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);

    // Coupon Validation
    Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

    // Checkout (Supports Guest + Auth)
    Route::post('/checkout/process', [CheckoutController::class, 'process']);

    // Order Tracking & Lookup
    Route::get('/orders/track/{trackingNumber}', [OrderController::class, 'track']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);

    // Banners
    Route::get('/banners', [BannerController::class, 'index']);

    // Admin Panel Management API
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard-stats', [AdminController::class, 'dashboardStats']);
        Route::get('/products', [AdminController::class, 'products']);
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    });
});
