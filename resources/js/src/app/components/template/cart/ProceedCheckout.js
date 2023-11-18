import React from "react";

export default function ProceedCheckout({
    totalPrice,
    discountPrice,
    discountPercentage,
    currency,
}) {
    return (
        totalPrice > 0 && (
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
                                <small>{discountPercentage + "%"} off</small>
                            </h5>
                        </>
                    )}
                </div>
                <div className="mt-3 checkout-action">
                    <button
                        type="button"
                        className="btn btn-primary checkout-btn w-100"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        )
    );
}
