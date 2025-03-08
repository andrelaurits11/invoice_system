<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserGoogle2FA;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Log; // Ensure this is added at the top
use App\Models\User;  // Lisa see rida

class TwoFactorController extends Controller
{
    // Kontrollige, kas kasutajal on 2FA aktiveeritud
    public function check(Request $request)
    {
        Log::info('Checking 2FA for email: ' . $request->email); // Logi päringu algus

        $user = User::where('email', $request->email)->first();

        if ($user) {
            Log::info('User found: ' . $request->email);
            $userGoogle2FA = UserGoogle2FA::where('user_id', $user->id)->first();

            if ($userGoogle2FA) {
                Log::info('2FA is enabled for user: ' . $request->email);
                return response()->json(['enabled' => true], 200);
            }
        }

        Log::warning('No 2FA enabled for user: ' . $request->email);
        return response()->json(['enabled' => false], 200);
    }

    // Google Authenticator 2FA aktiveerimine
    public function enable(Request $request)
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        // Salvestame kasutaja 2FA salajase võtme
        $userGoogle2FA = UserGoogle2FA::updateOrCreate(
            ['user_id' => auth()->id()],
            ['google2fa_secret' => $secret]
        );

        Log::info('2FA enabled for user: ' . auth()->id());

        $url = 'otpauth://totp/MyApp:' . auth()->user()->email . '?secret=' . $secret . '&issuer=MyApp&algorithm=SHA1&digits=6&period=30';
        $qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=' . urlencode($url) . '&size=200x200';

        return response()->json(['qrCodeUrl' => $qrCodeUrl, 'secret' => $secret]);
    }

    // Google Authenticator 2FA koodide valideerimine


    public function verify2FA(Request $request)
{
    Log::info('Received 2FA code:', [
        'code' => $request->code,
        'email' => $request->email,
    ]);

    $request->validate([
        'code' => 'required|numeric',
        'email' => 'required|email',
    ]);

    // Eemaldame kõik tühikud
    $cleanedCode = str_replace(' ', '', $request->code);
    Log::info('Cleaned code: ' . $cleanedCode);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        Log::error('User not found for email: ' . $request->email);
        return response()->json(['message' => 'Kasutajat ei leitud.'], 404);
    }

    // Kontrollime 2FA koodi õigsust
    $userGoogle2FA = UserGoogle2FA::where('user_id', $user->id)->first();

    if ($userGoogle2FA && $userGoogle2FA->validateCode($cleanedCode)) {
        // Kui kood on õige, siis genereerime API tokeni
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => '2FA success',
            'token' => $token, // Tagastame tokeni
        ], 200);
    }

    Log::error('Invalid 2FA code for user: ' . $user->email);
    return response()->json(['message' => 'Vale 2FA kood'], 400);
}


}
