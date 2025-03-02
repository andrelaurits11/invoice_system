<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\User; // To use the User model

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
            'status' => 'required|string|in:makse_ootel,makstud,ootel,osaliselt_makstud',
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
                'status' => $validated['status'], // Storing the status
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
            'status' => 'required|string|in:makse_ootel,makstud,ootel,osaliselt_makstud', // Validate status during update (optional)
            'items' => 'required|array',
            'items.*.description' => 'required|string',
            'items.*.rate' => 'required|numeric',
            'items.*.quantity' => 'required|integer',
        ]);

        try {
            // Recalculate total based on updated items data
            $total = collect($validated['items'])->reduce(function ($sum, $item) {
                return $sum + ($item['rate'] * $item['quantity']);
            }, 0);

            // Update the main invoice fields and total
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
                'total' => $total, // Update total value
                'status' => $validated['status'] ?? $invoice->status, // Update status if provided
            ]);

            // Delete old items and add new ones
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
        // Validate necessary data
        if (!$request->has('email') || !$request->has('invoiceDetails') || !$request->has('pdf') || !$request->has('user_id')) {
            return response()->json(['error' => 'Missing required data.'], 400); // 400 Bad Request
        }

        $email = $request->email; // Recipient's email address
        $invoiceID = $request->invoiceDetails['invoiceID']; // Invoice ID
        $pdf = $request->pdf; // PDF (base64 format)
        $userID = $request->user_id; // Sender's user ID

        // Find the user from the database
        $user = User::find($userID);
        if (!$user) {
            return response()->json(['error' => 'Sender not found.'], 404); // 404 Not Found
        }

        // Set file name and storage location
        $pdfFileName = 'invoice_' . $invoiceID . '.pdf';
        $pdfPath = 'invoices/' . $pdfFileName;

        // Store the PDF
        Storage::put($pdfPath, base64_decode($pdf));

        // Check if the file was stored successfully
        if (!Storage::exists($pdfPath)) {
            \Log::error("❌ PDF saving failed: $pdfPath");
            return response()->json(['error' => 'PDF saving failed.'], 500);
        }

        // Prepare email data
        $mailData = [
            'invoiceID'   => $invoiceID,
            'pdf_path'    => $pdfPath,
            'senderEmail' => $user->email,        // Sender's email address from users table
            'senderName'  => $user->businessname, // Sender's business name from users table
        ];

        try {
            // Send the email
            Mail::to($email)->send(new InvoiceMail($mailData, $user->email, $user->businessname));

            // If the email was sent successfully, delete the temporary file
            Storage::delete($pdfPath);

            return response()->json(['message' => 'Email sent successfully!']);
        } catch (\Exception $e) {
            // If email sending failed, log the error and leave the file
            \Log::error('Error sending email:', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Email sending failed.'], 500);
        }
    }

    public function getInvoices(Request $request)
    {
        // Kontrollige, kas kasutaja on autentitud
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Logige, et autentimine õnnestus ja kasutaja ID on saadud
        \Log::info('Kasutaja ID:', ['user_id' => $userId]);

        // Vaikimisi väärtused
        $limit = $request->query('limit', 15); // Vaikimisi 15 arvet
        $page = $request->query('page', 1); // Vaikimisi 1. leht

        // Kontrollige, et limit oleks positiivne number
        if ($limit <= 0) {
            return response()->json(['error' => 'Limit must be a positive number.'], 400);
        }

        // Logige päringu parameetrid
        \Log::info('Päringu parameetrid:', ['limit' => $limit, 'page' => $page]);

        // Kasutame Eloquenti päringut koos leheküljendusega
        $invoices = Invoice::where('user_id', $userId) // Filtreerime õigesti kasutaja järgi
                            ->paginate($limit, ['*'], 'page', $page); // Pagineerime, kasutades $limit ja $page parameetreid

        // Logige päringu SQL ja parameetrid
        \Log::info('SQL päring:', ['query' => $invoices->toSql(), 'bindings' => $invoices->getBindings()]);

        // Kontrollige, kas päring tagastab õiged arved
        \Log::info('Leitud arved:', ['invoices_count' => $invoices->count(), 'invoices' => $invoices->items()]);

        // Kontrollige pagineerimist
        if ($invoices->count() > 0) {
            \Log::info('Pagineeritud arved:', ['page_count' => $invoices->count(), 'current_page' => $invoices->currentPage()]);
        } else {
            \Log::warning('Ei leitud arveid kasutajale', ['user_id' => $userId]);
        }

        // Tagastage andmed vastusena
        return response()->json([
            'data' => $invoices->items(), // Tagastame ainult praeguse lehe arved
            'total_count' => $invoices->total(), // Kõikide arvete arv (kõik lehed kokku)
            'current_page' => $invoices->currentPage(), // Praegune leht
            'last_page' => $invoices->lastPage(), // Viimane leht
            'limit' => $limit, // Näitame, mitu arvet on piiratud igal lehel
        ]);
    }





}
