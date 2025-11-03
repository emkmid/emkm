<?php

namespace App\Exceptions;

use Exception;

class PaymentException extends Exception
{
    protected $errorCode;
    protected $transactionId;
    protected $paymentMethod;

    public function __construct(
        string $message = "", 
        string $errorCode = "PAYMENT_ERROR", 
        ?string $transactionId = null,
        ?string $paymentMethod = null,
        int $code = 0, 
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        
        $this->errorCode = $errorCode;
        $this->transactionId = $transactionId;
        $this->paymentMethod = $paymentMethod;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getTransactionId(): ?string
    {
        return $this->transactionId;
    }

    public function getPaymentMethod(): ?string
    {
        return $this->paymentMethod;
    }

    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'error' => $this->getMessage(),
                'error_code' => $this->getErrorCode(),
                'transaction_id' => $this->getTransactionId(),
                'payment_method' => $this->getPaymentMethod(),
            ], 400);
        }

        return redirect()->route('subscription.error')
            ->withErrors(['payment' => $this->getMessage()])
            ->withInput();
    }
}