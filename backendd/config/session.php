<?php

use Illuminate\Support\Str;

return [

    'driver' => env('SESSION_DRIVER', 'cookie'), // Kasutame 'cookie' draiverit

    'lifetime' => env('SESSION_LIFETIME', 120),

    'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),

    'encrypt' => env('SESSION_ENCRYPT', false),

    'files' => storage_path('framework/sessions'),

    'connection' => env('SESSION_CONNECTION'),

    'table' => env('SESSION_TABLE', 'sessions'),

    'store' => env('SESSION_STORE'),

    'lottery' => [2, 100],

    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    'path' => env('SESSION_PATH', '/'),

    'domain' => env('SESSION_DOMAIN', 'localhost'), // Veenduge, et see vastab teie domeenile või seadistage null, kui kindel pole

    'secure' => env('SESSION_SECURE_COOKIE', false), // True ainult HTTPS jaoks

    'http_only' => env('SESSION_HTTP_ONLY', true),

    'same_site' => env('SESSION_SAME_SITE', 'lax'), // "lax" on vaikimisi. Kasutage "none", kui HTTPS ja cross-origin on vajalik

    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),

];
