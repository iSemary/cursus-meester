import React, { useState } from "react";
import PaymentSelectorModal from "../Course/PaymentSelectorModal";

export default function ProceedCheckout({
    totalPrice,
    discountPrice,
    discountPercentage,
    currency,
}) {
    const [showModal, setShowModal] = useState(false);

    const handleCheckOut = () => {
        setShowModal(true);
    };

    return (
        totalPrice > 0 && (
            <>
                <PaymentSelectorModal
                    isShow={showModal}
                    setShowModal={setShowModal}
                    paymentTypeId={null}
                    paymentType={2}
                />
                <div className="px-3">
                    <div className="checkout-prices">
                        <h6 className="text-muted font-weight-bold">Total:</h6>
                        <h3 className="mb-0 font-weight-bold">{`${currency}${totalPrice}`}</h3>
                        {totalPrice !== discountPrice && (
                            <>
                                <h5 className="my-0 text-muted">
                                    <s>{`${currency}${discountPrice}`}</s>
                                </h5>
                                <h5 className="my-0 text-muted">
                                    <small>
                                        {discountPercentage + "%"} off
                                    </small>
                                </h5>
                            </>
                        )}
                    </div>
                    <div className="mt-3 checkout-action">
                        <button
                            type="button"
                            onClick={() => handleCheckOut()}
                            className="btn btn-primary checkout-btn w-100"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </>
        )
    );
}
