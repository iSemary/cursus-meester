import React, { useEffect, useState } from "react";
import axiosConfig from "../../axiosConfig/axiosConfig";
import toastAlert from "../../utilities/Alert";
import { useAuth } from "../../hooks/AuthProvider";
import { useRouter } from "next/navigation";
import PaymentSelectorModal from "./PaymentSelectorModal";

export default function PurchaseCourseButtons({ id, inCart }) {
    const [cart, setCart] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { user } = useAuth();
    const router = useRouter();

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
        setShowModal(true);
    };

    const navigateToLogin = () => {
        router.push("/");
    };

    useEffect(() => {
        setCart(inCart);
    }, []);

    return (
        <>
            <PaymentSelectorModal
                isShow={showModal}
                setShowModal={setShowModal}
                paymentTypeId={id}
                paymentType={1}
            />
            <div className="row m-auto">
                <button
                    className="w-100 btn btn-primary"
                    type="button"
                    onClick={
                        user
                            ? cart
                                ? () => removeItemFromCart(id)
                                : () => addItemToCart(id)
                            : () => navigateToLogin()
                    }
                >
                    {cart ? "Remove from cart" : "Add to cart"}
                </button>

                <button
                    className="w-100 mt-2 btn btn-outline-primary"
                    type="button"
                    onClick={
                        user
                            ? () => handlePurchaseCourse(id)
                            : () => navigateToLogin()
                    }
                >
                    Purchase Now
                </button>
            </div>
        </>
    );
}
