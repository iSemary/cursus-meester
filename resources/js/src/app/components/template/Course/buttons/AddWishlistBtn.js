import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import axiosConfig from "../../../axiosConfig/axiosConfig";
import toastAlert from "../../../utilities/Alert";

export default function AddWishlistBtn({ id, addWishlistCallback }) {
    const [currentIcon, setCurrentIcon] = useState(<FaRegHeart size={20} />);

    /** handle add wishlist item */
    const handleAddWishlist = (id) => {
        axiosConfig
            .post(`wishlist/${id}`)
            .then((response) => {
                toastAlert(response.data.message, "success");
                if (addWishlistCallback) addWishlistCallback();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <button
            className="btn text-primary border-0 add-wishlist-btn"
            title="Add wishlist"
            onClick={() => handleAddWishlist(id)}
            onMouseEnter={() => setCurrentIcon(<FaHeart size={20} />)}
            onMouseLeave={() => setCurrentIcon(<FaRegHeart size={20} />)}
        >
            {currentIcon}
        </button>
    );
}
