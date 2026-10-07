<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * Display a listing of active banners for the public frontend slider.
     */
    public function index()
    {
        $banners = Banner::where('is_active', true)
            ->orderBy('position', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $banners,
        ]);
    }

    /**
     * Display all banners for admin management (both active and inactive).
     */
    public function adminIndex()
    {
        $banners = Banner::orderBy('position', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $banners,
        ]);
    }

    /**
     * Store a newly created banner.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'image_path' => 'required|string|max:1000',
            'button_text' => 'nullable|string|max:100',
            'button_url' => 'nullable|string|max:500',
            'position' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $banner = Banner::create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'image_path' => $validated['image_path'],
            'button_text' => $validated['button_text'] ?? 'Shop Now',
            'button_url' => $validated['button_url'] ?? '/shop',
            'position' => $validated['position'] ?? 0,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Banner created successfully',
            'data' => $banner,
        ], 201);
    }

    /**
     * Display the specified banner.
     */
    public function show($id)
    {
        $banner = Banner::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $banner,
        ]);
    }

    /**
     * Update the specified banner.
     */
    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'image_path' => 'sometimes|required|string|max:1000',
            'button_text' => 'nullable|string|max:100',
            'button_url' => 'nullable|string|max:500',
            'position' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->has('title')) $banner->title = $validated['title'];
        if ($request->has('subtitle')) $banner->subtitle = $validated['subtitle'];
        if ($request->has('image_path')) $banner->image_path = $validated['image_path'];
        if ($request->has('button_text')) $banner->button_text = $validated['button_text'] ?: 'Shop Now';
        if ($request->has('button_url')) $banner->button_url = $validated['button_url'] ?: '/shop';
        if ($request->has('position')) $banner->position = $validated['position'] ?? 0;
        if ($request->has('is_active')) $banner->is_active = $request->boolean('is_active');

        $banner->save();

        return response()->json([
            'success' => true,
            'message' => 'Banner updated successfully',
            'data' => $banner,
        ]);
    }

    /**
     * Remove the specified banner.
     */
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Banner deleted successfully',
        ]);
    }
}
