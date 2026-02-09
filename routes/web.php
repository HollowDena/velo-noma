<?php

use App\Http\Controllers\BicycleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RentalController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BicycleController::class, 'index'])
    ->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::post('/rentals', [RentalController::class, 'store'])
        ->name('rentals.store');
});

require __DIR__.'/settings.php';
