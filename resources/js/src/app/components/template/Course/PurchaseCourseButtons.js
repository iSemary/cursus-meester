import React, { useEffect, useState } from "react";
import axiosConfig from "../../axiosConfig/axiosConfig";
import toastAlert from "../../utilities/Alert";

export default function PurchaseCourseButtons({ id, inCart }) {
    const [cart, setCart] = useState(false);

    /** Add course item to cart list */
    const addItemToCart = (id) => {
        axiosConfig.post(`cart`, { course_id: id }).then((response) => {
            toastAlert(response.data.message, "success");
            setCart(true);
        });
    };

    /** Remove course item from cart list */
    const removeItemFromCart = (id) => {
        axiosConfig.delete(`cart/${id}`).then((response) => {
            toastAlert(response.data.message, "success");
            setCart(false);
        });
    };

    const handlePurchaseCourse = (id) => {
        
    };

    useEffect(() => {
        setCart(inCart);
    }, []);

    return (
        <div className="row m-auto">
            <button
                className="w-100 btn btn-primary"
                type="button"
                onClick={
                    cart
                        ? () => removeItemFromCart(id)
                        : () => addItemToCart(id)
                }
            >
                {cart ? "Remove from cart" : "Add to cart"}
            </button>

            <button
                className="w-100 mt-2 btn btn-outline-primary"
                type="button"
                onClick={() => handlePurchaseCourse(id)}
            >
                Purchase Now
            </button>
        </div>
    );
}
