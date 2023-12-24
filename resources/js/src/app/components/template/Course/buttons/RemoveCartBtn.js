import React from "react";
import { BsCartXFill } from "react-icons/bs";
import axiosConfig from "../../../axiosConfig/axiosConfig";
import toastAlert from "../../../utilities/Alert";

export default function RemoveCartBtn({ id, removeCartCallback }) {
    const handleRemoveCart = (id) => {
        axiosConfig
            .delete(`cart/${id}`)
            .then((response) => {
                toastAlert(response.data.message, "success");
                if (removeCartCallback) removeCartCallback();
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <button
            className="btn text-primary border-0 remove-cart-btn ms-3"
            onClick={() => handleRemoveCart(id)}
            title="Remove From Cart"
        >
            <BsCartXFill size={20} />
        </button>
    );
}
