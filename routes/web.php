<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard/ECommerce');
});

Route::get('/calendar', function () {
    return Inertia::render('Calendar');
});

Route::get('/profile', function () {
    return Inertia::render('Profile');
});

Route::get('/form-elements', function () {
    return Inertia::render('Form/FormElements');
});

Route::get('/form-layout', function () {
    return Inertia::render('Form/FormLayout');
});

Route::get('/tables', function () {
    return Inertia::render('Tables');
});

Route::get('/settings', function () {
    return Inertia::render('Settings');
});

Route::get('/chart', function () {
    return Inertia::render('Chart');
});

Route::get('/ui/alerts', function () {
    return Inertia::render('UIElements/Alerts');
});

Route::get('/ui/buttons', function () {
    return Inertia::render('UIElements/Buttons');
});

Route::get('/signup', function () {
    return Inertia::render('Authentication/SignUp');
});

Route::get('/signin', function () {
    return Inertia::render('Authentication/SignIn');
});
