<!DOCTYPE html>
<html>

<head>
</head>

<body>
    <p>
        Dear {{ $data['name'] }},
    </p>
    <p>
        Congratulations! You have successfully purchased a new ({{ count($data['courses']) }}) courses.
    </p>
    <p>
        Cart Details:
    <ul>
        <li><strong>Date of Purchase:</strong> {{ $data['created_at'] }}</li>
        <li><strong>Reference Number:</strong> {{ $data['reference_number'] }}</li>
    </ul>
    <hr />
    <p>Courses:</p>
    <ul>
        @foreach ($data['courses'] as $course)
            <li>{{ $course->title }}</li>
        @endforeach
    </ul>

    </p>
    <p>
        You can view and start learning the new courses from the following link:
        <a href="{{ $data['redirect_url'] }}"
            style="background-color: #3490dc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Learning
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
