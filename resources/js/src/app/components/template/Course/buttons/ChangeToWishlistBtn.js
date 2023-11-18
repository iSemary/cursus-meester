import React from "react";

export default function ChangeToWishlistBtn({ id, handleMoveToWishlist }) {
    return (
        <button
            className="btn text-primary border-0"
            onClick={() => handleMoveToWishlist(id)}
        >
            Move to wishlist
        </button>
    );
}
