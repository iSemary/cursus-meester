import React from "react";
import { FaCartPlus } from "react-icons/fa6";
import axiosConfig from "../../../axiosConfig/axiosConfig";
import toastAlert from "../../../utilities/Alert";

export default function AddCardBtn({ id, addCartCallback }) {
    /** handle add cart item */
    const handleAddCart = (id) => {
        axiosConfig
            .post(`cart`, { course_id: id })
            .then((response) => {
                toastAlert(response.data.message, "success");
                if (addCartCallback) addCartCallback();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <button
            className="btn text-primary border-0 add-cart-btn"
            onClick={() => handleAddCart(id)}
            title="Add To Cart"
        >
            <FaCartPlus size={20} />
        </button>
    );
}
