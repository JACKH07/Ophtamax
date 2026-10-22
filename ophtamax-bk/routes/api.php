<?php

use App\Http\Controllers\Api\LegacyApiController;
use Illuminate\Support\Facades\Route;

/*
| Préfixe automatique Laravel : /api
| Front (Vite) → /api/v1/* → LegacyApiController → legacy-api/v1/*
*/

Route::any('/v1/{path?}', [LegacyApiController::class, 'handle'])
    ->where('path', '.*')
    ->name('api.v1');
