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
});
