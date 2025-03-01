<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Profiili vaatamine
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    // Profiili andmete uuendamine
    public function update(Request $request)
{
    $user = $request->user();

    // Validatsioon kõigi väljade kohta
    $validated = $request->validate([
        'name' => 'string|max:255',
        'email' => 'email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'address2' => 'nullable|string|max:255',
        'state' => 'nullable|string|max:255',
        'zip' => 'nullable|string|max:20',
        'country' => 'nullable|string|max:255',
        'businessname' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:255',
    ]);

    // Uuendame kõik väljad, mis on edastatud
    $user->update($validated);

    return response()->json(['message' => 'Andmed uuendatud', 'user' => $user]);
}


    // Lisame näiteks aadressi (või muu lisainfo)
    public function add(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $user->address = $validated['address'];
        $user->save();

        return response()->json(['message' => 'Aadress lisatud', 'user' => $user]);
    }
}
