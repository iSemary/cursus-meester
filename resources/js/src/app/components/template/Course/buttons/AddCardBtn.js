import React from "react";
import { FaCartPlus } from "react-icons/fa6";

export default function AddCardBtn({ id }) {
    /** handle add cart item */
    const handleAddCart = (id) => {
        axiosConfig.post(`cart`, { course_id: id }).then((response) => {
            toastAlert(response.data.message, "success");
        });
    };

    return (
        <button
            className="btn text-primary border-0 add-cart-btn"
            onClick={() => handleAddCart(id)}
            title="Add To Cart"
        >
            <FaCartPlus size={20}/>
        </button>
    );
}
