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
    // Courses and categories
    Route::resource('courses', 'CoursesController');
    Route::resource('categories', 'CategoriesController');
});
