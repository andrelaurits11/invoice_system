<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class InvoiceController extends Controller
{

    public function index(): JsonResponse
{
    $userId = auth()->id();
    if (!$userId) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $invoices = Invoice::with('items')->where('user_id', $userId)->get();

    // Selge JSON ilma vigadeta
    return response()->json($invoices);
}

    public function store(Request $request)
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

    public function sendInvoice(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'invoiceDetails.invoiceID' => 'required|string',
    ]);

    $invoiceID = $validated['invoiceDetails']['invoiceID'];

    $invoice = Invoice::where('invoice_id', $invoiceID)
        ->where('user_id', auth()->id())
        ->first();

    if (!$invoice) {
        return response()->json(['error' => 'Invoice not found or access denied.'], 404);
    }

    try {
        Mail::to($validated['email'])->send(new \App\Mail\InvoiceMail($invoice));
        return response()->json(['message' => 'Invoice sent successfully.']);
    } catch (\Exception $e) {
        \Log::error('Error sending email: ', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Failed to send email.'], 500);
    }
}

}
