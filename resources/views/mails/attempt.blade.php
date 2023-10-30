<!DOCTYPE html>
<html>

<head>
</head>

<body>
    <p>
        Dear {{ $body['name'] }},
    </p>
    <p>
        There has been a recent login attempt on your account using your email address [{{ $body['email'] }}].
        Below are the details:
    </p>
    <ul>
        <li><strong>Time:</strong> {{ $body['created_at'] }}</li>
        <li><strong>IP:</strong> {{ $body['ip'] }}</li>
        <li><strong>Device / Browser:</strong> {{ $body['agent'] }}</li>
    </ul>
    <p>
        If you did not initiate this login, please take immediate action to secure your account.
    </p>
    <p>
        If you have any concerns or questions, please contact our support team.
    </p>
    <p>
        Thanks,<br>
        {{ env('APP_NAME') }} Team.
    </p>
</body>

</html>
