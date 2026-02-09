<?php

use App\Http\Controllers\Admin\RentalController as AdminRentalController;
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

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/rentals', [AdminRentalController::class, 'index'])->name('rentals.index');
    Route::delete('/rentals/{rental}', [AdminRentalController::class, 'destroy'])->name('rentals.destroy');
});

require __DIR__.'/settings.php';
