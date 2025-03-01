<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\UserController;
use App\Mail\InvoiceMail;
use App\Models\User;


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
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'update']);     // Andmete muutmine
    Route::post('/profile/add', [UserController::class, 'add']);   // Uute andmete lisamine
    Route::post('/profile/upload-logo', [UserController::class, 'uploadLogo']);
    Route::get('/profile/logo', [UserController::class, 'getLogo']);


    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);
    // E-kirja saatmine kõikidele aadressidele
    Route::post('/invoices/send', function (Request $request) {
        // ✅ Kontrollime, kas `user_id` eksisteerib
        if (!$request->has('user_id')) {
            return response()->json(['error' => 'Kasutaja ID puudub.'], 400);
        }

        // ✅ Logime, et näha, kas `user_id` tuli API päringuga
        \Log::info('API sai user_id:', ['user_id' => $request->user_id]);

        // Otsi kasutaja andmebaasist
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['error' => 'Saatja ei leitud.'], 404);
        }

        // Salvestame PDF-i
        $pdfPath = 'invoices/' . $request->invoiceDetails['invoiceID'] . '.pdf';
        Storage::put($pdfPath, base64_decode($request->pdf));

        // E-maili andmed
        $mailData = [
            'invoiceID'   => $request->invoiceDetails['invoiceID'],
            'pdf_path'    => $pdfPath,
            'senderEmail' => $user->email,  // Võtame e-maili Users tabelist
            'senderName'  => $user->businessname, // Võtame nime Users tabelist
        ];

        // ✅ Logime, et näha, mis andmed meilisaatmisele lähevad
        \Log::info('Saatmise andmed:', $mailData);

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
