<?php

Route::group(['prefix' => 'auth'], function()
{
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
    Route::post('forgot', 'AuthController@forgot');
    Route::post('reset', 'AuthController@reset');
    Route::post('reset_email', 'AuthController@reset_password_email');
    Route::get('roles', 'RolesController@index');
    Route::resource('users', 'UsersController')->except(['create', 'edit']);
    Route::resource('courses', 'CoursesController')->except(['create', 'edit']);
    Route::resource('categories', 'CategoriesController')->except(['create', 'edit']);
    Route::resource('regulations', 'RegulationsController')->except(['create', 'edit']);
    Route::resource('territories', 'TerritoriesController')->except(['create', 'edit']);
    Route::post('classes/approve', 'ClassesController@approve');
    Route::post('classes/cancel', 'ClassesController@cancel');
    Route::post('classes/roster', 'ClassesController@roster');
    Route::get('classes/my-courses', 'ClassesController@userCoursesOnly');
    Route::get('classes/my-territories', 'ClassesController@userTerritoriesOnly');
    Route::get('classes/hasPendingRosters', 'ClassesController@hasPendingRosters');
    Route::resource('classes', 'ClassesController')->except(['create', 'edit']);
    Route::resource('sponsors', 'SponsorsController')->except(['create', 'edit']);
    Route::resource('venues', 'VenuesController')->except(['create', 'edit']);
    Route::get('materials', 'CoursesController@materials');
});
