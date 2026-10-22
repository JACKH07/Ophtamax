<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ApiExitException;
use Illuminate\Http\JsonResponse;

/**
 * Pont vers l'API PHP Ophtamax (legacy-api/) — même contrat /api/v1 que le front.
 */
class LegacyApiController extends Controller
{
    public function handle(?string $path = null): JsonResponse
    {
        $relative = ltrim((string) $path, '/');
        $base = base_path('legacy-api/v1');

        if ($relative === '' || $relative === '/') {
            return response()->json([
                'message' => 'Ophtamax API (Laravel)',
                'prefix' => '/api/v1',
            ]);
        }

        if (! defined('OPHTAMAX_EMBEDDED')) {
            define('OPHTAMAX_EMBEDDED', true);
        }

        $exact = $base.'/'.$relative.'.php';
        if (is_file($exact)) {
            return $this->runScript($exact);
        }

        $parts = explode('/', $relative);
        $resource = $parts[0] ?? '';
        $id = $parts[1] ?? null;
        $action = $parts[2] ?? null;

        foreach ([
            $base.'/'.$resource.'.php',
            $base.'/'.$resource.'/index.php',
        ] as $script) {
            if (is_file($script)) {
                $GLOBALS['_API_RESOURCE'] = $resource;
                $GLOBALS['_API_ID'] = $id;
                $GLOBALS['_API_ACTION'] = $action;

                return $this->runScript($script);
            }
        }

        return response()->json([
            'message' => 'Endpoint introuvable',
            'path' => '/api/v1/'.$relative,
        ], 404);
    }

    private function runScript(string $script): JsonResponse
    {
        try {
            require $script;

            return response()->json([
                'message' => 'Réponse API vide',
                'data' => null,
            ], 500);
        } catch (ApiExitException $e) {
            return response()->json($e->payload, $e->status);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erreur API',
                'data' => null,
                'detail' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
