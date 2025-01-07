<?php

use Laravel\Sanctum\Sanctum;

return [
    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Kui kasutate Sanctumi küpsise-põhist autentimist, lisage oma frontendi domeen siia.
    | Näiteks: 'localhost:3000' või teie tootmisdomeen.
    */
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost:3000')),


    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Siin määratakse autentimisvalvurid, mida Sanctum kasutab.
    | Tavaliselt jätke see vaikimisi "web"-ks.
    */
    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Token Expiration
    |--------------------------------------------------------------------------
    |
    | Kui soovite API tokenitel aegumistähtaega, määrake see siin (minutites).
    | Kui ei ole määratud (null), siis tokenid ei aegu.
    */
    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Middleware
    |--------------------------------------------------------------------------
    |
    | Siin saate kohandada Sanctumi kasutatavaid middleware'e.
    */
    'middleware' => [
        'verify_csrf_token' => \App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => \App\Http\Middleware\EncryptCookies::class,
    ],
];
