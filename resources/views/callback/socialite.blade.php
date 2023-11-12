@if (isset($formattedUser))
    <script>
        const formattedUserData = <?php echo json_encode($formattedUser); ?>;
        window.opener.postMessage({
            type: 'userData',
            data: formattedUserData
        }, 'http://127.0.0.1:3000');
        window.close();
    </script>
@else
    <p>Something went wrong!</p>
@endif
