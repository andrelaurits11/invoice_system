<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        // Ainult sisselogitud kasutaja kliendid
        $clients = Client::where('user_id', auth()->id())->get();
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'contactPerson' => 'required',
            'email' => 'required|email',
        ]);

        $client = Client::create([
            'company_name' => $validated['name'],
            'contact_person' => $validated['contactPerson'],
            'email' => $validated['email'],
            'phone' => $request->phone,
            'address' => $request->address1,
            'address2' => $request->address2,
            'state' => $request->state,
            'zip' => $request->zip,
            'country' => $request->country,
            'user_id' => auth()->id(), // Lisa kasutaja ID
        ]);

        return response()->json($client, 201);
    }
}
