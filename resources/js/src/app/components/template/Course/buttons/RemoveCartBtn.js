import React from "react";
import { BsCartXFill } from "react-icons/bs";

export default function RemoveCartBtn({ id, handleRemoveCart }) {
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
