<!DOCTYPE html>
<html>

<head>
</head>

<body>
    <p>
        Dear {{ $data['name'] }},
    </p>
    <p>
        Congratulations! You have successfully purchased a new course.
    </p>
    <p>
        Course Details:
    <ul>
        <li><strong>Course Name:</strong> {{ $data['course_name'] }}</li>
        <li><strong>Date of Purchase:</strong> {{ $data['created_at'] }}</li>
        <li><strong>Reference Number:</strong> {{ $data['reference_number'] }}</li>
    </ul>
    </p>
    <p>
        You can view and start learning the course from the following link:
        <a href="{{ $data['course_url'] }}"
            style="background-color: #3490dc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Enroll Now
        </a>
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
