<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('brand')->default('Ember Edge');
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new_arrival')->default(false);
            $table->enum('status', ['draft', 'active', 'archived'])->default('active');
            $table->json('tags')->nullable();
            $table->string('size_guide_type')->nullable(); // 'men', 'women', 'kids'
            $table->timestamps();

            $table->index(['category_id', 'status']);
            $table->index('is_featured');
            $table->index('is_new_arrival');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
