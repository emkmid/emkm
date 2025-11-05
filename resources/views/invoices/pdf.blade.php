<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            margin-bottom: 30px;
            overflow: hidden;
        }
        
        .header-left {
            float: left;
            width: 50%;
        }
        
        .header-right {
            float: right;
            width: 45%;
            text-align: right;
        }
        
        .logo {
            max-width: 150px;
            max-height: 80px;
            margin-bottom: 10px;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .company-info {
            font-size: 11px;
            color: #666;
            line-height: 1.8;
        }
        
        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .invoice-details {
            font-size: 11px;
        }
        
        .invoice-details table {
            width: 100%;
        }
        
        .invoice-details td {
            padding: 3px 0;
        }
        
        .invoice-details .label {
            font-weight: bold;
            width: 40%;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-draft { background: #f3f4f6; color: #6b7280; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .status-cancelled { background: #e5e7eb; color: #4b5563; }
        
        .section {
            margin: 30px 0;
            overflow: hidden;
        }
        
        .bill-to {
            float: left;
            width: 50%;
        }
        
        .bill-from {
            float: right;
            width: 45%;
        }
        
        .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .section-content {
            font-size: 12px;
            line-height: 1.8;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        
        .items-table thead {
            background: #f9fafb;
        }
        
        .items-table th {
            padding: 12px 8px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
            color: #374151;
            text-transform: uppercase;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .items-table .text-right {
            text-align: right;
        }
        
        .items-table .text-center {
            text-align: center;
        }
        
        .totals {
            float: right;
            width: 40%;
            margin-top: 20px;
        }
        
        .totals table {
            width: 100%;
        }
        
        .totals td {
            padding: 8px 0;
        }
        
        .totals .label {
            text-align: left;
            font-size: 12px;
            color: #6b7280;
        }
        
        .totals .amount {
            text-align: right;
            font-size: 12px;
            font-weight: bold;
        }
        
        .totals .total-row {
            border-top: 2px solid #e5e7eb;
            padding-top: 12px !important;
        }
        
        .totals .total-row .label {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .totals .total-row .amount {
            font-size: 16px;
            color: #2c3e50;
        }
        
        .notes-section {
            clear: both;
            margin-top: 40px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 4px;
        }
        
        .notes-title {
            font-size: 12px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
        }
        
        .notes-content {
            font-size: 11px;
            color: #6b7280;
            line-height: 1.8;
            white-space: pre-wrap;
        }
        
        .footer {
            clear: both;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
        }
        
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header clearfix">
            <div class="header-left">
                @if($invoice->user->businessProfile && $invoice->user->businessProfile->logo_url)
                    <img src="{{ public_path('storage/' . $invoice->user->businessProfile->logo_path) }}" alt="Logo" class="logo">
                @endif
                
                @if($invoice->user->businessProfile)
                    <div class="company-name">{{ $invoice->user->businessProfile->business_name }}</div>
                    <div class="company-info">
                        @if($invoice->user->businessProfile->address)
                            {{ $invoice->user->businessProfile->full_address }}<br>
                        @endif
                        @if($invoice->user->businessProfile->phone)
                            Tel: {{ $invoice->user->businessProfile->phone }}<br>
                        @endif
                        @if($invoice->user->businessProfile->email)
                            Email: {{ $invoice->user->businessProfile->email }}<br>
                        @endif
                        @if($invoice->user->businessProfile->tax_number)
                            NPWP: {{ $invoice->user->businessProfile->tax_number }}
                        @endif
                    </div>
                @else
                    <div class="company-name">{{ $invoice->user->name }}</div>
                    <div class="company-info">{{ $invoice->user->email }}</div>
                @endif
            </div>
            
            <div class="header-right">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-details">
                    <table>
                        <tr>
                            <td class="label">Invoice Number:</td>
                            <td>{{ $invoice->invoice_number }}</td>
                        </tr>
                        <tr>
                            <td class="label">Date:</td>
                            <td>{{ $invoice->invoice_date->format('d M Y') }}</td>
                        </tr>
                        <tr>
                            <td class="label">Due Date:</td>
                            <td>{{ $invoice->due_date->format('d M Y') }}</td>
                        </tr>
                        <tr>
                            <td class="label">Status:</td>
                            <td>
                                <span class="status-badge status-{{ $invoice->status }}">
                                    {{ ucfirst($invoice->status) }}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Bill To / From -->
        <div class="section clearfix">
            <div class="bill-to">
                <div class="section-title">Bill To:</div>
                <div class="section-content">
                    <strong>{{ $invoice->customer->display_name }}</strong><br>
                    @if($invoice->customer->email)
                        {{ $invoice->customer->email }}<br>
                    @endif
                    @if($invoice->customer->phone)
                        {{ $invoice->customer->phone }}<br>
                    @endif
                    @if($invoice->customer->full_address)
                        {{ $invoice->customer->full_address }}
                    @endif
                </div>
            </div>
        </div>
        
        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 45%;">Description</th>
                    <th style="width: 15%;" class="text-center">Qty</th>
                    <th style="width: 15%;" class="text-right">Unit Price</th>
                    <th style="width: 20%;" class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->description }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item->amount, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        <!-- Totals -->
        <div class="totals">
            <table>
                <tr>
                    <td class="label">Subtotal:</td>
                    <td class="amount">Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                </tr>
                @if($invoice->discount_rate > 0)
                <tr>
                    <td class="label">Discount ({{ $invoice->discount_rate }}%):</td>
                    <td class="amount">- Rp {{ number_format($invoice->discount_amount, 0, ',', '.') }}</td>
                </tr>
                @endif
                @if($invoice->tax_rate > 0)
                <tr>
                    <td class="label">Tax ({{ $invoice->tax_rate }}%):</td>
                    <td class="amount">Rp {{ number_format($invoice->tax_amount, 0, ',', '.') }}</td>
                </tr>
                @endif
                <tr class="total-row">
                    <td class="label">Total:</td>
                    <td class="amount">Rp {{ number_format($invoice->total, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>
        
        <!-- Notes -->
        @if($invoice->notes || $invoice->terms)
        <div class="notes-section">
            @if($invoice->notes)
                <div class="notes-title">Notes:</div>
                <div class="notes-content">{{ $invoice->notes }}</div>
            @endif
            
            @if($invoice->terms)
                <div class="notes-title" style="margin-top: 15px;">Payment Terms:</div>
                <div class="notes-content">{{ $invoice->terms }}</div>
            @endif
        </div>
        @endif
        
        <!-- Footer -->
        <div class="footer">
            <p>Thank you for your business!</p>
            @if($invoice->user->businessProfile && $invoice->user->businessProfile->website)
                <p>{{ $invoice->user->businessProfile->website }}</p>
            @endif
        </div>
    </div>
</body>
</html>
