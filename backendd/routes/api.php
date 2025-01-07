<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;

// Avalikud marsruudid
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// CSRF-tokeni marsruut
Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

// Kaitstud marsruudid
Route::middleware('auth:sanctum')->group(function () {

    // Autentimisega seotud marsruudid
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);

    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::post('/invoices/send', [InvoiceController::class, 'sendInvoice']);
});


