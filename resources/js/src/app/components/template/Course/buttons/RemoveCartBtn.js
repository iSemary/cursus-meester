import React from "react";

export default function RemoveCartBtn({ id, handleRemoveCart }) {
    return (
        <button
            className="btn text-primary border-0"
            onClick={() => handleRemoveCart(id)}
        >
            Remove
        </button>
    );
}
