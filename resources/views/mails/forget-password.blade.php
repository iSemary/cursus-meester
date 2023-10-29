<!DOCTYPE html>
<html>

<head>
</head>

<body>
    <p>
        Dear {{ $body['name'] }},
    </p>
    <p>
        We received a request to reset your password. If you did not make this request, please ignore this email.
    </p>
    <p>
        To reset your password, click the button below:
    </p>
    <p>
        <a href="{{ env('APP_URL') . '/reset-password?token=' . $body['token'] }}"
            style="background-color: #3490dc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset
            Password</a>
    </p>
    <p>
        If you are having trouble clicking the "Reset Password" button, you can also copy and paste the following link
        into your browser:
        <br>
        <a href="{{ env('APP_URL') . '/reset-password?token=' . $body['token'] }}">
            {{ env('APP_URL') . '/reset-password?token=' . $body['token'] }}</a>
    </p>
    <p>
        If you have any questions or need assistance, please contact our support team.
    </p>
    <p>
        Thanks,<br>
        {{ env('APP_NAME') }} Team.
    </p>
</body>

</html>
