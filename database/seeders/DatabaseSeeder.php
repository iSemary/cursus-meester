<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // Create an admin user for moderation
        $user = \App\Models\User::create([
            'full_name' => 'Administration User',
            'username' => 'administration',
            'email' => 'administration@app.com',
            'password' => bcrypt("123456789")
        ]);

        // Create Roles and Permissions seeder
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Assign admin user to administration role
        $user->assignRole('super_admin');
    }
}
