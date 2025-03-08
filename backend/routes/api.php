<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TwoFactorController;
use App\Mail\InvoiceMail;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Auth\NewPasswordController;


// Avalikud marsruudid
Route::get('/check-2fa', [TwoFactorController::class, 'check']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-2fa', [TwoFactorController::class, 'verify']);
Route::post('/verify-2fa', [TwoFactorController::class, 'verify2FA']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);
Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => __($status)])
        : response()->json(['message' => __($status)], 400);
});




// CSRF-tokeni marsruut
Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

// Kaitstud marsruudid, kus kasutaja peab olema sisse logitud
Route::middleware('auth:sanctum')->post('/enable-2fa', [TwoFactorController::class, 'enable']);

// Kaitstud marsruudid
Route::middleware('auth:sanctum')->group(function () {
    // Google Authenticator 2FA koodi kontroll


    // Autentimisega seotud marsruudid
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);
    Route::put('/clients/{id}', [ClientController::class, 'update']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'update']);
    Route::post('/profile', [UserController::class, 'update']);
    Route::post('/profile/add', [UserController::class, 'add']);
    Route::post('/profile/upload-logo', [UserController::class, 'uploadLogo']);
    Route::get('/profile/logo', [UserController::class, 'getLogo']);

    Route::get('/invoices', [InvoiceController::class, 'getInvoices']);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);

    // E-kirja saatmine kõikidele aadressidele
    Route::post('/invoices/send', function (Request $request) {
        if (!$request->has('user_id')) {
            return response()->json(['error' => 'Kasutaja ID puudub.'], 400);
        }

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['error' => 'Saatja ei leitud.'], 404);
        }

        $pdfPath = 'invoices/' . $request->invoiceDetails['invoiceID'] . '.pdf';
        Storage::put($pdfPath, base64_decode($request->pdf));

        $mailData = [
            'invoiceID'   => $request->invoiceDetails['invoiceID'],
            'pdf_path'    => $pdfPath,
            'senderEmail' => $user->email,
            'senderName'  => $user->businessname,
        ];

        try {
            Mail::to($request->email)->send(new InvoiceMail($mailData));
            Storage::delete($pdfPath);
            return response()->json(['message' => 'E-mail saadetud']);
        } catch (\Exception $e) {
            \Log::error('E-maili saatmise viga:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'E-maili saatmine ebaõnnestus.'], 500);
        }
    });
});
