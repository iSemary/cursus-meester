<div style="text-align: center;">
    <img src="{{ asset('assets/images/gif/auth-loader.gif') }}" alt="auth loader">
</div>
@if (isset($referenceNumber))
    <?php
    $redirectUrl = env('APP_ENV') == 'local' ? 'http://127.0.0.1:3000' : env('APP_URL');
    $redirectPath = "$redirectUrl/payment/$referenceNumber";
    ?>
    <script>
        setTimeout(() => {
            window.location.href = `{{ $redirectPath }}`
        }, 1000);
    </script>
@else
    <p>Something went wrong!</p>
@endif
