import React from "react";
import { FaCartPlus } from "react-icons/fa6";

export default function ChangeToCartBtn({ id, handleMoveToCart }) {
    return (
        <button
            className="btn text-primary border-0 move-to-cart-btn"
            title="Move to cart"
            onClick={() => handleMoveToCart(id)}
        >
            <FaCartPlus size={20} />
        </button>
    );
}
