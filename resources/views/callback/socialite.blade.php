<div style="text-align: center;">
    <img src="{{ asset('assets/images/gif/auth-loader.gif') }}" alt="auth loader">
</div>
@if (isset($formattedUser))
    <?php
    $token = $formattedUser['access_token'];
    $redirectUrl = env('APP_ENV') == 'local' ? 'http://127.0.0.1:3000' : env('APP_URL');
    $redirectPath = "$redirectUrl/validate/$token";
    ?>
    <script>
        window.location.href = `{{ $redirectPath }}`
    </script>
@else
    <p>Something went wrong!</p>
@endif
