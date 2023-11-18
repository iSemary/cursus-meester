<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use LaratrustSeeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // Create an admin user for moderation
        \App\Models\User::create([
            'full_name' => 'Administration User',
            'username' => 'administration',
            'email' => 'administration@app.com',
            'password' => bcrypt("123456789")
        ]);

    }
}
