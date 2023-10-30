import React from "react";
import Swal from "sweetalert2";

export default function toastAlert(
    message,
    type = "info",
    time = 3000,
    position = "top-end"
) {
    return Swal.fire({
        title: message,
        icon: type, // You can pass 'success', 'error', 'info', etc. as the type
        position: position,
        toast: true,
        showConfirmButton: false,
        timer: time,
    });
}
