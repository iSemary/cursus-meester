import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axiosConfig from "../../axiosConfig/axiosConfig";
import { IoCloseSharp } from "react-icons/io5";
import { ImSpinner10 } from "react-icons/im";
import toastAlert from "../../utilities/Alert";
import Cookies from "js-cookie";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

export default function PaymentSelectorModal({
    paymentType, // 1-> Single Item | 2-> Cart
    paymentTypeId, // Single item id | in case cart will be ignored
    setShowModal,
    isShow,
}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handleClose = () => {
        setShowModal(false);
        setShow(false);
    };

    const handleChangePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleProcessedToPayment = (e) => {
        e.preventDefault();
        setLoading(true);

        axiosConfig
            .post(
                paymentType === 1
                    ? "payments/purchase/course/" + paymentTypeId
                    : "payments/purchase/cart",
                {
                    payment_method: paymentMethod,
                }
            )
            .then((response) => {
                handleOpenPopup(
                    response.data.data.payment_link,
                    response.data.data.reference_number
                );
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    const handleOpenPopup = (link, referenceNumber) => {
        let windowWidth = 500;
        let windowHeight = 600;

        // Calculate the center position for the new window
        let windowLeft = window.screen.width / 2 - windowWidth / 2;
        let windowTop = window.screen.height / 2 - windowHeight / 2;

        let paymentWindow = window.open(
            link,
            "Payment Window",
            "width=" +
                windowWidth +
                ",height=" +
                windowHeight +
                ",left=" +
                windowLeft +
                ",top=" +
                windowTop
        );
        const checkClosed = setInterval(() => {
            if (paymentWindow.closed) {
                clearInterval(checkClosed);
                const paymentStatus = Cookies.get(
                    `PAYMENT_STATUS_${referenceNumber}`
                );
                if (paymentStatus === "true") {
                    toastAlert(
                        "Cheers! Your purchase completed successfully!",
                        "success"
                    );
                    setPaymentSuccess(true);
                    setTimeout(() => {
                        Cookies.remove(`PAYMENT_STATUS_${referenceNumber}`);
                        location.reload();
                    }, 3000);
                } else {
                    setLoading(false);
                    setPaymentSuccess(false);
                    toastAlert("Invalid payment.", "error");
                }
            }
        }, 1000);
    };

    useEffect(() => {
        setShow(isShow);
    }, [isShow]);

    return (
        <Modal
            show={show}
            size="md"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header>
                <Modal.Title>Payment Method</Modal.Title>
                <Button variant="" onClick={handleClose}>
                    <IoCloseSharp size={25} />
                </Button>
            </Modal.Header>
            <Modal.Body>
                <form method="POST" onSubmit={handleProcessedToPayment}>
                    <div className="payment-methods-container">
                        <label
                            className="payment-method-input"
                            htmlFor="mastercardInput"
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value={1}
                                id="mastercardInput"
                                onChange={handleChangePaymentMethod}
                            />
                            <span>
                                <Image
                                    src="/assets/images/icons/mastercard.png"
                                    width={35}
                                    height={25}
                                    className="mx-4"
                                    alt="mastercard payment"
                                />
                                <span className="font-weight-bold">
                                    Mastercard
                                </span>
                            </span>
                        </label>
                        <label
                            className="payment-method-input"
                            htmlFor="paypalInput"
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value={2}
                                id="paypalInput"
                                onChange={handleChangePaymentMethod}
                            />
                            <span>
                                <Image
                                    src="/assets/images/icons/paypal.png"
                                    width={35}
                                    height={25}
                                    className="mx-4"
                                    alt="paypal payment"
                                />
                                <span className="font-weight-bold">Paypal</span>
                            </span>
                        </label>
                    </div>
                    <div className="mt-2 form-group text-right">
                        <Button
                            variant={paymentSuccess ? "success" : "primary"}
                            type="submit"
                            disabled={!paymentMethod || loading}
                        >
                            {paymentSuccess ? (
                                <FaCheckCircle />
                            ) : loading ? (
                                <ImSpinner10 className="icon-spin-1" />
                            ) : (
                                ""
                            )}{" "}
                            {paymentSuccess
                                ? "Purchased!"
                                : "Processed to payment"}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}
