<?php

namespace App\Support;

use Exception;

class ApiExitException extends Exception
{
    public function __construct(
        public readonly mixed $payload,
        public readonly int $status = 200,
    ) {
        parent::__construct('API exit');
    }
}
