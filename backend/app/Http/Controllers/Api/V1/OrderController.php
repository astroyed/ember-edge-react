<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function userOrders(Request $request)
    {
        $orders = $request->user()->orders()
            ->with(['items.product.images', 'shipment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

    public function show(Request $request, $orderNumber)
    {
        $query = Order::with(['items.product.images', 'shipment', 'payments']);

        if ($request->user()) {
            $query->where(function ($q) use ($request) {
                $q->where('user_id', $request->user()->id)
                  ->orWhere('order_number', $request->orderNumber);
            });
        }

        $order = $query->where('order_number', $orderNumber)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    public function track($trackingNumber)
    {
        $order = Order::with(['items', 'shipment'])
            ->where('tracking_number', $trackingNumber)
            ->orWhere('order_number', $trackingNumber)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'No order found matching tracking or order number.',
            ], 404);
        }

        // Generate status steps timeline
        $statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        $currentStatusIndex = array_search($order->status, $statuses);
        if ($currentStatusIndex === false) {
            $currentStatusIndex = 0;
        }

        $timeline = array_map(function ($status, $index) use ($currentStatusIndex, $order) {
            return [
                'status' => $status,
                'label' => ucfirst($status),
                'completed' => $index <= $currentStatusIndex,
                'current' => $index === $currentStatusIndex,
            ];
        }, $statuses, array_keys($statuses));

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number,
                'tracking_number' => $order->tracking_number,
                'courier_name' => $order->courier_name ?: 'Ember Logistics',
                'status' => $order->status,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'estimated_delivery' => $order->shipment ? ($order->shipment->estimated_delivery ? $order->shipment->estimated_delivery->format('M d, Y') : '3-5 Business Days') : '3-5 Business Days',
                'shipping_address' => $order->shipping_address,
                'total_amount' => $order->total_amount,
                'items' => $order->items,
                'timeline' => $timeline,
            ]
        ]);
    }
}
