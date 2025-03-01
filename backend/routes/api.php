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

    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);
    // E-kirja saatmine kõikidele aadressidele
    Route::post('/invoices/send', function (Request $request) {
        // Kontrollige, kas kõik vajalikud andmed on olemas
        if (!$request->has('email') || !$request->has('invoiceDetails') || !$request->has('pdf')) {
            return response()->json(['error' => 'Puuduvad vajalikud andmed.'], 400); // 400 Bad Request
        }

        $email = $request->email; // Saaja e-posti aadress
        $invoiceID = $request->invoiceDetails['invoiceID']; // Arve ID
        $pdf = $request->pdf; // PDF, mis saadeti (näiteks base64 formaadis)

        // PDF-i salvestamine ajutiselt
        $pdfPath = 'invoices/' . $invoiceID . '.pdf';
        Storage::put($pdfPath, base64_decode($pdf));

        // Määrame saatja andmed (ei kontrolli enam kasutajat)
        $senderEmail = 'sender@example.com';  // Saatja e-posti aadress
        $senderName = 'Arve Teenus';          // Saatja nimi

        // Pane Mailable'ile kaasa saatja andmed
        $mailData = [
            'invoiceID' => $invoiceID,
            'pdf_path' => $pdfPath,
            'senderEmail' => $senderEmail,   // Saatja e-posti aadress
            'senderName'  => $senderName,    // Saatja nimi
        ];

        try {
            // Saadame e-kirja
            Mail::to($email)
                ->send(new InvoiceMail($mailData));

            // Eemaldame ajutise PDF faili
            Storage::delete($pdfPath);

            return response()->json(['message' => 'E-mail sent successfully']);
        } catch (\Exception $e) {
            // Kui on viga meili saatmisel
            \Log::error('E-maili saatmise viga:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'E-maili saatmine ebaõnnestus.'], 500);
        }
    });
});
