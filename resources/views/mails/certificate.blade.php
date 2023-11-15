<!DOCTYPE html>
<html>

<head>
</head>

<body>
    <p>
        Dear {{ $data['name'] }},
    </p>
    <p>
        Congratulations! You have successfully claimed a new certificate on {{ $data['course_name'] }}.
    </p>
    <p>
        Certificate Details:
    <ul>
        <li><strong>Course Name:</strong> {{ $data['course_name'] }}</li>
        <li><strong>Date of Achievement:</strong> {{ $data['finished_at'] }}</li>
        <li><strong>Reference Code:</strong> {{ $data['reference_code'] }}</li>
    </ul>
    </p>
    <p>
        You can view and download your certificate from the following link:
        <a href="{{ $data['certificate_link'] }}">Download Certificate</a>
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
