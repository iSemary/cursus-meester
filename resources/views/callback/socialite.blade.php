@if (isset($formattedUser))
    <?php
    setcookie('user', 'John', time() + 7 * 24 * 60 * 60, '/');
    
    ?>
    <script>
        window.opener.postMessage({
            user: {!! json_encode($formattedUser) !!}
        }, "{{ env('APP_URL') }}/");
        window.close();
    </script>
@else
    <p>Something went wrong!</p>
@endif
