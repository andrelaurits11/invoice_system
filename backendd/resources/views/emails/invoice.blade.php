<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->id }}</title>
</head>
<body>
    <h1>Invoice #{{ $invoice->id }}</h1>
    <p>Dear {{ $invoice->company_name }},</p>
    <p>Please find the invoice details below:</p>

    <ul>
        @foreach ($invoice->items as $item)
            <li>{{ $item['description'] }}: {{ $item['rate'] }} x {{ $item['quantity'] }}</li>
        @endforeach
    </ul>

    <p>Due Date: {{ $invoice->due_date }}</p>
    <p>Total: {{ $invoice->items->sum(fn($item) => $item['rate'] * $item['quantity']) }}</p>
</body>
</html>
