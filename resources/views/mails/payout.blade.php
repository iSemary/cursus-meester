<!DOCTYPE html>
<html>

<head>
</head>

<body>
    <p>
        Dear {{ $data['name'] }},
    </p>
    <p>
        Congratulations, New amount has been transferred to your account.
    </p>
    <p>
        Transfer Details:
    <ul>
        <li><strong>Total Transferred Amount:</strong> ${{ number_format($data['total_amount'], 2) }}</li>
        <li><strong>Date of transfer:</strong> {{ $data['created_at'] }}</li>
        <li><strong>Reference Number:</strong> {{ $data['reference_number'] }}</li>
    </ul>
    </p>
    <p>
        If you have any questions or concerns, please feel free to contact us.
    </p>
    <p>
        Thank you for using {{ env('APP_NAME') }}!
    </p>
    <p>
        Best regards,<br>
        The {{ env('APP_NAME') }} Team
    </p>
</body>

</html>
