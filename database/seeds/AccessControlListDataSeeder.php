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
                "update-self" => "Can update own profile",
                // school admins
                "create-admin" => "Can create School Administrators",
                "update-admin" => "Can update School Administrators",
                "delete-admin" => "Can delete School Administrators",
                "approve-admin" => "Can approve School Administrators",
                "read-admin" => "Can see and search School Administrators",
                // categories
                "create-category" => "Can create Categories",
                "update-category" => "Can update Categories",
                "delete-category" => "Can delete Categories",
                "read-category" => "Can see and search Categories",
                // courses
                "create-course" => "Can create Courses",
                "update-course" => "Can update Courses",
                "delete-course" => "Can delete Courses",
                "read-course" => "Can see and search Courses",
                // territories
                "create-territory" => "Can create Territories",
                "update-territory" => "Can update Territories",
                "delete-territory" => "Can delete Territories",
                "read-territory" => "Can see and search Territories",
                // state regulations
                "create-state" => "Can create State Regulations",
                "update-state" => "Can update State Regulations",
                "delete-state" => "Can delete State Regulations",
                "read-state" => "Can see and search State Regulations"
            ],
            "admin" => [
                "update-self" => "Can update own profile",
                // classes
                "create-class" => "Can create Classes",
                "update-class" => "Can update Classes",
                "delete-class" => "Can delete Classes",
                "approve-class" => "Can approve Classes",
                "cancel-class" => "Can cancel Classes",
                "archive-class" => "Can archive Classes",
                "read-class" => "Can see and search Classes",
                // sponsors
                "create-sponsor" => "Can create Sponsors",
                "update-sponsor" => "Can update Sponsors",
                "delete-sponsor" => "Can delete Sponsors",
                "read-sponsor" => "Can see and search Sponsors",
                // instructors
                "create-instructor" => "Can create Instructors",
                "update-instructor" => "Can update Instructors",
                "delete-instructor" => "Can delete Instructors",
                "read-instructor" => "Can see and search Instructors",
                "approve-instructor" => "Can approve Instructors",
                // venues
                "create-venue" => "Can create Venues",
                "update-venue" => "Can update Venues",
                "delete-venue" => "Can delete Venues",
                "read-venue" => "Can see and search Venues"
            ],
            "instructor" => [
                "update-self" => "Can update own profile",
                // classes
                "create-class" => "Can create Classes",
                "enroll-in-class" => "Can enroll Students in his Class",
                "archive-class" => "Can archive Classes",
                "cancel-class" => "Can cancel Classes",
                // sponsors
                "create-sponsor" => "Can create Sponsors",
                "update-sponsor" => "Can update Sponsors",
                "delete-sponsor" => "Can delete Sponsors",
                "read-sponsor" => "Can see and search Sponsors",
                // venues
                "create-venue" => "Can create Venues",
                "update-venue" => "Can update Venues",
                "delete-venue" => "Can delete Venues",
                "read-venue" => "Can see and search Venues",
                // courses
                "read-course-material" => "Can see and Course Materials"
            ],
            "student" => [
                "update-self" => "Can update own profile",
                "read-class" => "Can see his Classes",
            ]
        ];

        // assign permissions to roles
        foreach ($roles as $key => $value) {
            $role_permissions = $permissions[$key];
            $role = new Role([
                'name'  => $key,
                'label' => $value
            ]);
            if ($role->save()) {
                foreach ($role_permissions as $permission) {
                    $role->assign($permission);
                }
            }
        }

        $user = User::find(1);
        $user->assign("super-admin");
        $user->assign("admin");
        $user->assign("instructor");
    }
}
