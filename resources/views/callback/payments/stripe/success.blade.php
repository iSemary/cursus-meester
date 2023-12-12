<div style="text-align: center;">
    <img src="{{ asset('assets/images/gif/auth-loader.gif') }}" alt="auth loader">
</div>
<script>
    setTimeout(() => {
        window.location.href = `/payment/{{ $referenceNumber }}`
    }, 1000);
</script>
