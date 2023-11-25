<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // Create all roles
        $superAdminRole = Role::create(['name' => 'super_admin']);
        $instructorRole = Role::create(['name' => 'instructor']);
        $studentRole = Role::create(['name' => 'student']);

        /**
         *  Super Admin role and permissions
         */
        $superAdminPermissions = ['categories', 'organizations', 'countries', 'industries', 'languages', 'wordings', 'currencies'];
        $superAdminPermissionResources = [];
        foreach ($superAdminPermissions as $resource) {
            Permission::create(['name' => 'create-' . $resource]);
            Permission::create(['name' => 'read-' . $resource]);
            Permission::create(['name' => 'update-' . $resource]);
            Permission::create(['name' => 'delete-' . $resource]);
            $superAdminPermissionResources[] = 'create-' . $resource;
            $superAdminPermissionResources[] = 'read-' . $resource;
            $superAdminPermissionResources[] = 'update-' . $resource;
            $superAdminPermissionResources[] = 'delete-' . $resource;
        }
        $superAdminRole->syncPermissions($superAdminPermissionResources);

        /**
         *  Instructor role and permissions
         */
        $instructorPermissions = ['courses', 'lectures', 'exams'];
        $instructorPermissionResources = [];
        foreach ($instructorPermissions as $resource) {
            Permission::create(['name' => 'create-' . $resource]);
            Permission::create(['name' => 'read-' . $resource]);
            Permission::create(['name' => 'update-' . $resource]);
            Permission::create(['name' => 'delete-' . $resource]);
            $instructorPermissionResources[] = 'create-' . $resource;
            $instructorPermissionResources[] = 'read-' . $resource;
            $instructorPermissionResources[] = 'update-' . $resource;
            $instructorPermissionResources[] = 'delete-' . $resource;
        }
        $instructorRole->syncPermissions($instructorPermissionResources);
    }
}
