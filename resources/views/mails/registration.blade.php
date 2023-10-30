<!DOCTYPE html>
<html>

<head>
</head>

<body>
    <p>
        Dear {{ $body['name'] }},
    </p>
    <p>
        Thank you for registration. To complete the registration process, please click the "Confirm Email" button below.
    </p>
    <p>
        <a href="{{ env('APP_URL') }}/verify/email/{{ $body['token'] }}"
            style="background-color: #3490dc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirm
            Email</a>
    </p>
    <p>
        If you are having trouble clicking the "Confirm Email" button, you can also copy and paste the following link
        into your browser:<br>
        <a
            href="{{ env('APP_URL') }}/verify/email/{{ $body['token'] }}">{{ env('APP_URL') }}/verify/email/{{ $body['token'] }}</a>
    </p>
    <p>
        If you did not initiate this registration, please ignore this email.
    </p>
    <p>
        Thanks,<br>
        {{ env('APP_NAME') }} Team.
    </p>
</body>

</html>
