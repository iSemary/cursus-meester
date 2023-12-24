import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import axiosConfig from "../../../axiosConfig/axiosConfig";
import toastAlert from "../../../utilities/Alert";

export default function RemoveWishlistBtn({ id, removeWishlistCallback }) {
    const [currentIcon, setCurrentIcon] = useState(<FaHeart size={20} />);

    const handleRemoveWishlist = (id) => {
        axiosConfig
            .delete(`wishlist/${id}`)
            .then((response) => {
                toastAlert(response.data.message, "success");
                if (removeWishlistCallback) removeWishlistCallback();
            })
            .catch((error) => {
                console.error(error);
            });
    };
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
