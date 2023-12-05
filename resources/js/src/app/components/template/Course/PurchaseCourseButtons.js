import React, { useEffect, useState } from "react";
import axiosConfig from "../../axiosConfig/axiosConfig";
import toastAlert from "../../utilities/Alert";

export default function PurchaseCourseButtons({ id, inCart }) {
    const [cart, setCart] = useState(false);

    const addItemToCart = (id) => {
        axiosConfig.post(`cart`, { course_id: id }).then((response) => {
            toastAlert(response.data.message, "success");
            setCart(true);
        });
    };

    const removeItemFromCart = (id) => {
        axiosConfig.delete(`cart/${id}`).then((response) => {
            toastAlert(response.data.message, "success");
            setCart(false);
        });
    };

    useEffect(() => {
        setCart(inCart);
    }, []);

    return (
        <div className="row m-auto">
            <button
                className="w-100 btn btn-primary"
                onClick={
                    cart
                        ? () => removeItemFromCart(id)
                        : () => addItemToCart(id)
                }
            >
                {cart ? "Remove from cart" : "Add to cart"}
            </button>

            <button className="w-100 mt-2 btn btn-outline-primary">
                Purchase Now
            </button>
        </div>
    );
}
