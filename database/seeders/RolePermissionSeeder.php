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
        $superAdminRole = Role::create(['name' => 'super_admin', 'guard_name' => 'api']);
        $instructorRole = Role::create(['name' => 'instructor', 'guard_name' => 'api']);
        Role::create(['name' => 'student', 'guard_name' => 'api']);

        /**
         *  Super Admin role and permissions
         */
        $superAdminPermissions = ['categories', 'organizations', 'countries', 'industries', 'languages', 'wordings', 'currencies'];
        $superAdminPermissionResources = [];
        foreach ($superAdminPermissions as $resource) {
            Permission::create(['name' => 'create-' . $resource, 'guard_name' => 'api']);
            Permission::create(['name' => 'read-' . $resource, 'guard_name' => 'api']);
            Permission::create(['name' => 'update-' . $resource, 'guard_name' => 'api']);
            Permission::create(['name' => 'delete-' . $resource, 'guard_name' => 'api']);
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
            Permission::create(['name' => 'create-' . $resource, 'guard_name' => 'api']);
            Permission::create(['name' => 'read-' . $resource, 'guard_name' => 'api']);
            Permission::create(['name' => 'update-' . $resource, 'guard_name' => 'api']);
            Permission::create(['name' => 'delete-' . $resource, 'guard_name' => 'api']);
            $instructorPermissionResources[] = 'create-' . $resource;
            $instructorPermissionResources[] = 'read-' . $resource;
            $instructorPermissionResources[] = 'update-' . $resource;
            $instructorPermissionResources[] = 'delete-' . $resource;
        }
        $instructorRole->syncPermissions($instructorPermissionResources);
    }
}
