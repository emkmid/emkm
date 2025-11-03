<?php

namespace App\Exceptions;

use Exception;

class SubscriptionException extends Exception
{
    protected $errorCode;
    protected $subscriptionId;

    public function __construct(
        string $message = "", 
        string $errorCode = "SUBSCRIPTION_ERROR", 
        ?int $subscriptionId = null,
        int $code = 0, 
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        
        $this->errorCode = $errorCode;
        $this->subscriptionId = $subscriptionId;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getSubscriptionId(): ?int
    {
        return $this->subscriptionId;
    }

    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'error' => $this->getMessage(),
                'error_code' => $this->getErrorCode(),
                'subscription_id' => $this->getSubscriptionId(),
            ], 400);
        }

        return redirect()->route('dashboard.packages')
            ->withErrors(['subscription' => $this->getMessage()])
            ->withInput();
    }
}