<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Models\User; // Lisa see rida, et kasutada User mudelit

class InvoiceController extends Controller
{
    /**
     * Get all invoices for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $invoices = Invoice::with('items')->where('user_id', $userId)->get();

        return response()->json($invoices);
    }

    /**
     * Show a single invoice by ID.
     */
    public function show($id): JsonResponse
    {
        $invoice = Invoice::with('items')->find($id);

        if (!$invoice || $invoice->user_id !== auth()->id()) {
            return response()->json(['error' => 'Invoice not found or access denied.'], 404);
        }

        return response()->json($invoice);
    }

    /**
     * Store a new invoice.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'invoice_id' => 'required|string|unique:invoices,invoice_id',
            'company_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'address1' => 'nullable|string',
            'address2' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip' => 'nullable|string',
            'country' => 'nullable|string',
            'due_date' => 'required|date',
            'items' => 'required|array',
            'items.*.description' => 'required|string',
            'items.*.rate' => 'required|numeric',
            'items.*.quantity' => 'required|integer',
        ]);

        try {
            $validated['user_id'] = auth()->id();

            $total = array_reduce($validated['items'], function ($sum, $item) {
                return $sum + ($item['rate'] * $item['quantity']);
            }, 0);

            $invoice = Invoice::create([
                'user_id' => $validated['user_id'],
                'invoice_id' => $validated['invoice_id'],
                'company_name' => $validated['company_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? '',
                'address1' => $validated['address1'] ?? '',
                'address2' => $validated['address2'] ?? '',
                'city' => $validated['city'] ?? '',
                'state' => $validated['state'] ?? '',
                'zip' => $validated['zip'] ?? '',
                'country' => $validated['country'] ?? '',
                'due_date' => $validated['due_date'],
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $invoice->items()->create($item);
            }

            return response()->json(['message' => 'Invoice created successfully.', 'invoice' => $invoice], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating invoice: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create invoice.'], 500);
        }
    }

    /**
     * Update an existing invoice.
     */
    public function update(Request $request, $id)
    {
        $invoice = Invoice::with('items')->find($id);

        if (!$invoice || $invoice->user_id !== auth()->id()) {
            return response()->json(['error' => 'Invoice not found or access denied.'], 404);
        }

        $validated = $request->validate([
            'company_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'address1' => 'nullable|string',
            'address2' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip' => 'nullable|string',
            'country' => 'nullable|string',
            'due_date' => 'required|date',
            'items' => 'required|array',
            'items.*.description' => 'required|string',
            'items.*.rate' => 'required|numeric',
            'items.*.quantity' => 'required|integer',
        ]);

        try {
            // Arvuta total uuesti, lähtudes uuendatud items andmetest
            $total = collect($validated['items'])->reduce(function ($sum, $item) {
                return $sum + ($item['rate'] * $item['quantity']);
            }, 0);

            // Uuenda invoices tabeli põhiväljad ja total
            $invoice->update([
                'company_name' => $validated['company_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address1' => $validated['address1'],
                'address2' => $validated['address2'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'zip' => $validated['zip'],
                'country' => $validated['country'],
                'due_date' => $validated['due_date'],
                'total' => $total, // Siin uuendatakse total väärtus
            ]);

            // Kustuta olemasolevad items ja lisa uued
            $invoice->items()->delete();
            foreach ($validated['items'] as $item) {
                $invoice->items()->create($item);
            }

            return response()->json(['message' => 'Invoice updated successfully.']);
        } catch (\Exception $e) {
            \Log::error('Error updating invoice:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update invoice.'], 500);
        }
    }

    /**
     * Send an invoice via email.
     */
    public function sendInvoice(Request $request)
{
    // Kontrollime, kas kõik vajalikud andmed on olemas
    if (!$request->has('email') || !$request->has('invoiceDetails') || !$request->has('pdf') || !$request->has('user_id')) {
        return response()->json(['error' => 'Puuduvad vajalikud andmed.'], 400); // 400 Bad Request
    }

    $email = $request->email; // Saaja e-posti aadress
    $invoiceID = $request->invoiceDetails['invoiceID']; // Arve ID
    $pdf = $request->pdf; // PDF (base64 formaadis)
    $userID = $request->user_id; // Kasutaja ID (saatja määramiseks)

    // Otsime kasutaja andmebaasist
    $user = User::find($userID);
    if (!$user) {
        return response()->json(['error' => 'Saatja ei leitud.'], 404); // 404 Not Found
    }

    // Määrame failinime ja salvestuskoha
    $pdfFileName = 'invoice_' . $invoiceID . '.pdf';
    $pdfPath = 'invoices/' . $pdfFileName;

    // Salvestame PDF-i
    Storage::put($pdfPath, base64_decode($pdf));

    // ✅ Kontrollime, kas fail salvestati edukalt
    if (!Storage::exists($pdfPath)) {
        \Log::error("❌ PDF salvestamine ebaõnnestus: $pdfPath");
        return response()->json(['error' => 'PDF salvestamine ebaõnnestus.'], 500);
    }

    // Valmistame e-kirja andmed
    $mailData = [
        'invoiceID'   => $invoiceID,
        'pdf_path'    => $pdfPath,
        'senderEmail' => $user->email,        // Saatja e-posti aadress users tabelist
        'senderName'  => $user->businessname, // Saatja ärinimi users tabelist
    ];

    try {
        // Saadame e-kirja
        Mail::to($email)->send(new InvoiceMail($mailData, $user->email, $user->businessname));

        // ✅ Kui e-kiri saadeti edukalt, kustutame ajutise faili
        Storage::delete($pdfPath);

        return response()->json(['message' => 'E-mail saadetud edukalt!']);
    } catch (\Exception $e) {
        // ❌ Kui e-kirja saatmine ebaõnnestus, logime vea ja jätame faili alles
        \Log::error('E-maili saatmise viga:', ['error' => $e->getMessage()]);

        return response()->json(['error' => 'E-maili saatmine ebaõnnestus.'], 500);
    }
}


}
