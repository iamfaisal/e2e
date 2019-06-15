<?php

namespace App\Http\Controllers;

use App\Role;
use Illuminate\Support\Facades\Auth;

class RolesController extends Controller
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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $roles = Role::orderBy('created_at', 'desc');
        return response()->json([
            'roles' => $roles->get()
        ], 200);
    }
}
