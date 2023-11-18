import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function RemoveWishlistBtn({ id, handleRemoveWishlist }) {
    const [currentIcon, setCurrentIcon] = useState(<FaHeart size={20} />);
    return (
        <button
            className="btn text-primary border-0 remove-wishlist-btn"
            title="Remove wishlist"
            onClick={() => handleRemoveWishlist(id)}
            onMouseEnter={() => setCurrentIcon(<FaRegHeart size={20} />)}
            onMouseLeave={() => setCurrentIcon(<FaHeart size={20} />)}
        >
            {currentIcon}
        </button>
    );
}
