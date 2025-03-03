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

    // Validatsioon (pilt on valikuline, ainult kui see on lisatud)
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



    // Uuenda ainult neid välju, mis on edastatud
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
    public function uploadLogo(Request $request)
{
    $user = Auth::user();

    $request->validate([
        'logo_picture' => 'required|image|mimes:jpg,png,jpeg|max:2048',
    ]);

    if ($request->hasFile('logo_picture')) {
        $file = $request->file('logo_picture');
        $filePath = $file->store('logos', 'public'); // Salvesta storage/app/public/logos
        $user->logo_picture = $filePath;
        $user->save();
    }

    return response()->json([
        'message' => 'Logo üleslaadimine õnnestus',
        'logo_picture' => $user->logo_picture,
    ]);
}
public function getLogo(Request $request)
{
    $user = auth()->user(); // Kasutaja tuvastamine
    if (!$user || !$user->logo_picture) {
        return response()->json(['error' => 'Logo puudub.'], 404);
    }

    $path = 'public/' . $user->logo_picture; // Veendu, et see vastaks failiteele!
    if (!Storage::exists($path)) {
        return response()->json(['error' => 'Faili ei leitud.'], 404);
    }

    $file = Storage::get($path);
    $type = Storage::mimeType($path);

    return response($file)->header('Content-Type', $type);
}
}
