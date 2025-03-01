<?php

return [
    'paths' => ['api/*','storage/*', 'sanctum/csrf-cookie'], // Lubatud API teed
    'allowed_methods' => ['*'], // Kõik HTTP meetodid
    'allowed_origins' => ['http://localhost:3000'], // Frontendi aadress
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Kõik päised
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Küpsiste ja autentimise tugi
];

