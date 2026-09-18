<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Card;

class StatsOverviewWidget extends BaseWidget
{
    protected function getCards(): array
    {
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $lowStockProducts = Product::where('stock', '<', 5)->where('is_active', true)->count();
        $totalProducts = Product::where('is_active', true)->count();

        $revenueThisMonth = Order::where('payment_status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->sum('total_amount');

        $ordersThisMonth = Order::whereMonth('created_at', now()->month)->count();

        return [
            Card::make('Total Revenue', 'PKR ' . number_format($totalRevenue))
                ->description('PKR ' . number_format($revenueThisMonth) . ' this month')
                ->descriptionIcon('heroicon-s-trending-up')
                ->color('success'),

            Card::make('Total Orders', $totalOrders)
                ->description($ordersThisMonth . ' orders this month')
                ->descriptionIcon('heroicon-s-shopping-bag')
                ->color('primary'),

            Card::make('Pending Orders', $pendingOrders)
                ->description('Awaiting processing')
                ->descriptionIcon('heroicon-s-clock')
                ->color($pendingOrders > 10 ? 'danger' : 'warning'),

            Card::make('Total Customers', $totalCustomers)
                ->description('Registered accounts')
                ->descriptionIcon('heroicon-s-users')
                ->color('success'),

            Card::make('Active Products', $totalProducts)
                ->description($lowStockProducts . ' low stock alerts')
                ->descriptionIcon($lowStockProducts > 0 ? 'heroicon-s-exclamation' : 'heroicon-s-check')
                ->color($lowStockProducts > 0 ? 'warning' : 'success'),
        ];
    }
}
