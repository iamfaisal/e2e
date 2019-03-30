<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    private $user;

    /**
     * constructor function.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->user = Auth::Guard('api')->user();
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }
}
