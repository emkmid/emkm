<?php

namespace App\Exceptions;

use Exception;

class MidtransException extends Exception
{
    protected $errorCode;
    protected $httpStatus;
    protected $response;

    public function __construct(
        string $message = "", 
        string $errorCode = "MIDTRANS_ERROR", 
        int $httpStatus = 500,
        $response = null,
        int $code = 0, 
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        
        $this->errorCode = $errorCode;
        $this->httpStatus = $httpStatus;
        $this->response = $response;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getHttpStatus(): int
    {
        return $this->httpStatus;
    }

    public function getResponse()
    {
        return $this->response;
    }

    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'error' => $this->getMessage(),
                'error_code' => $this->getErrorCode(),
                'http_status' => $this->getHttpStatus(),
            ], $this->getHttpStatus());
        }

        return redirect()->back()
            ->withErrors(['payment' => $this->getMessage()])
            ->withInput();
    }
}