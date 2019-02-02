<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'faisal',
            'email' => 'faisal@gmail.com',
            'password' => bcrypt('secret'),
            'email_verified_at' => Carbon::now()
        ]);
    }
}
