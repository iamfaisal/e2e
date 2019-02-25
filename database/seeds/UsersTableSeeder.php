<?php

use App\User;
use App\Profile;
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
            'name' => 'terrye',
            'email' => 'tiannetta@amerifirst.us',
            'password' => bcrypt('secret'),
            'email_verified_at' => Carbon::now()
        ]);
        $user = User::find(1);
        $user->profile()->save(new Profile([
            'first_name' => 'Terrye',
            'last_name' => 'Iannetta'
        ]));
    }
}
