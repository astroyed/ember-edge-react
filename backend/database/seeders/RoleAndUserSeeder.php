<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    public function run()
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@emberedge.com'],
            [
                'name' => 'Ember Edge Admin',
                'phone' => '+92 300 1234567',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Staff User
        User::updateOrCreate(
            ['email' => 'staff@emberedge.com'],
            [
                'name' => 'Inventory Staff',
                'phone' => '+92 300 7654321',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'email_verified_at' => now(),
            ]
        );

        // Demo Customer
        User::updateOrCreate(
            ['email' => 'customer@emberedge.com'],
            [
                'name' => 'Zainab Ahmed',
                'phone' => '+92 321 9876543',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => now(),
            ]
        );
    }
}
