<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Role;
use App\Permission;

class AccessControlListDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // define base rules
        $roles = [
            "super-admin"   => "System Admin",
            "admin"         => "School Admin",
            "instructor"    => "Instructor",
            "student"       => "Student",
        ];

        // define base permissions for each role
        $permissions = [
            "super-admin" => [
                "create-admin" => "Can create School Administrators"
            ]
        ];

        // $role->assign($permission)
        $user = User::find(1);
        // $user->assign($roles["super-admin"])
    }
}
