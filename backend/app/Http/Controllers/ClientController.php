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
    public function show($id)
    {
        $client = Client::where('id', $id)
            ->where('user_id', auth()->id()) // Ensure the client belongs to the authenticated user
            ->first();

        if (!$client) {
            return response()->json(['error' => 'Client not found or access denied.'], 404);
        }

        return response()->json($client);
    }



    public function update(Request $request, $id)
    {
        // Kliendi leidmine ID järgi
        $client = Client::where('id', $id)->where('user_id', auth()->id())->first();

        // Kui klienti ei leita, tagastame 404 vea
        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        // Validatsioon
        $validated = $request->validate([
            'name' => 'required',
            'contactPerson' => 'required',
            'email' => 'required|email',
        ]);

        // Kliendi andmete uuendamine
        $client->update([
            'company_name' => $validated['name'],
            'contact_person' => $validated['contactPerson'],
            'email' => $validated['email'],
            'phone' => $request->phone,
            'address' => $request->address1,
            'address2' => $request->address2,
            'state' => $request->state,
            'zip' => $request->zip,
            'country' => $request->country,
            'city' => $request->city,
        ]);

        return response()->json($client);
    }

}
