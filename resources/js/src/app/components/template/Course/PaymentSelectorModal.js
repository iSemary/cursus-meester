import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axiosConfig from "../../axiosConfig/axiosConfig";

export default function PaymentSelectorModal({ setShowModal, isShow }) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShowModal(false);
        setShow(false);
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
            </Modal.Header>
            <Modal.Body>
                <form method="POST">
                    <div className="payment-methods-container">
                        <label
                            className="payment-method-input"
                            htmlFor="mastercardInput"
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value="1"
                                id="mastercardInput"
                            />
                            <span>
                                <img
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
                            htmlFor="visaInput"
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value="1"
                                id="visaInput"
                            />
                            <span>
                                <img
                                    src="/assets/images/icons/visa.png"
                                    width={35}
                                    height={25}
                                    className="mx-4"
                                    alt="visa payment"
                                />
                                <span className="font-weight-bold">Visa</span>
                            </span>
                        </label>
                        <label
                            className="payment-method-input"
                            htmlFor="paypalInput"
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value="2"
                                id="paypalInput"
                            />
                            <span>
                                <img
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
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" disabled="">
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
