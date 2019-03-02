<?php

Route::group(['prefix' => 'auth'], function()
{
    // User Authentication
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::post('forgot', 'AuthController@forgot');
    Route::post('reset', 'AuthController@reset');
    Route::post('reset_email', 'AuthController@reset_password_email');
    // User Management
    Route::resource('users', 'UsersController')->except(['create', 'edit']);
    // System Admin
    Route::resource('courses', 'CoursesController')->except(['create', 'edit']);
    Route::resource('categories', 'CategoriesController')->except(['create', 'edit']);
    Route::resource('regulations', 'RegulationsController')->except(['create', 'edit']);
    Route::resource('territories', 'TerritoriesController')->except(['create', 'edit']);
    // School Admin
    Route::get('roles', 'RolesController@index');
    Route::resource('sponsors', 'SponsorsController')->except(['create', 'edit']);
    Route::resource('venues', 'VenuesController')->except(['create', 'edit']);
});
