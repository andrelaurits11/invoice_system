<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        \App\Http\Middleware\TrustHosts::class,
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class, // See rida peab olema
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * Middleware grupid, mida saab määrata marsruutidele.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class, // Küpsiste krüptimine
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class, // Küpsiste lisamine vastustele
            \Illuminate\Session\Middleware\StartSession::class, // Sessiooni alustamine
            \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class, // Veateadete jagamine sessioonist
            \App\Http\Middleware\VerifyCsrfToken::class, // CSRF tokeni valideerimine
            \Illuminate\Routing\Middleware\SubstituteBindings::class, // Mudelite automaatne sidumine
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Http\Middleware\HandleCors::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * The application's route middleware.
     *
     * Need middleware'd saab määrata individuaalselt marsruutidele.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class, // Autentimine
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class, // Basic auth
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class, // Cache päised
        'can' => \Illuminate\Auth\Middleware\Authorize::class, // Õiguste valideerimine
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class, // Suunamine, kui kasutaja on autentitud
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class, // Parooli valideerimine
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class, // Allkirjastatud URL-ide valideerimine
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class, // Päringute piiramine
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class, // E-maili kinnituse valideerimine
    ];
}
