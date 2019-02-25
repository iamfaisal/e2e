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
    // System Admin
    Route::resource('courses', 'CoursesController')->except(['create', 'edit']);
    Route::resource('categories', 'CategoriesController')->except(['create', 'edit']);
    Route::resource('regulations', 'RegulationsController')->except(['create', 'edit']);
});
