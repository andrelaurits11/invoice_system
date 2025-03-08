<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserGoogle2FA;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    /**
     * Register a new user and log them in.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Validate incoming data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Automatically log the user in
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token, // Return token
        ], 201);
    }

    /**
     * Login an existing user and generate a token.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
{
    // Validate incoming data
    $validator = Validator::make($request->all(), [
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Attempt to log in the user
    if (Auth::attempt($request->only('email', 'password'))) {
        $user = Auth::user();

        // Kontrollige, kas 2FA on aktiveeritud
        $userGoogle2FA = UserGoogle2FA::where('user_id', $user->id)->first();
        if ($userGoogle2FA) {
            // Kui 2FA on aktiveeritud, tagastage vajalik 2FA staatuse teade
            return response()->json([
                'message' => '2FA is enabled, please provide the verification code.',
                'requires_2fa' => true,
                'user' => $user,
            ], 200);
        }

        // Kui 2FA ei ole aktiveeritud, logige sisse nagu tavaliselt
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token, // Return token
        ], 200);
    }

    return response()->json(['message' => 'Vale parool'], 401);
}


    /**
     * Logout the current user and invalidate the token.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Revoke all tokens for the authenticated user
        $user = Auth::user();
        if ($user) {
            $user->tokens()->delete();
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful'], 200);
    }
}
