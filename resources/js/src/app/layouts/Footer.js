"use client";
import React, { useState } from "react";
import { FaSquareTwitter, FaProductHunt } from "react-icons/fa6";
import { BsFacebook } from "react-icons/bs";
import toastAlert from "../components/utilities/Alert";
import axios from "axios";

const Footer = () => {
    const [NewsletterEmail, setNewsletterEmail] = useState("");

    const handleNewsletterValue = (e) => {
        setNewsletterEmail(e.target.value);
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Call newsletter subscribe API
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/newsletter/subscribe",
                { email: NewsletterEmail },
                {}
            )
            .then((response) => {
                // Check the response status
                if (response.data.status === 200) {
                    toastAlert(response.data.message, "success", 3000);
                    // Clear form value
                    setNewsletterEmail("");
                } else {
                    toastAlert(response.data.message, "error", 5000);
                }
            })
            .catch((error) => {
                toastAlert(error, "error");
            });
    };

    return (
        <footer className="container py-5">
            <div className="row">
                <div className="col-6 col-md-2 mb-3">
                    <h5>Section</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Home
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Features
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Pricing
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                FAQs
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                About
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="col-6 col-md-2 mb-3">
                    <h5>Section</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Home
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Features
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Pricing
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                FAQs
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                About
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="col-6 col-md-2 mb-3">
                    <h5>Section</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Home
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Features
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                Pricing
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                FAQs
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="#" className="nav-link p-0 text-muted">
                                About
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="col-md-5 offset-md-1 mb-3">
                    <form method="POST" onSubmit={handleNewsletterSubmit}>
                        <h5>Subscribe to our newsletter</h5>
                        <p>
                            Monthly digest of what's new and exciting from us.
                        </p>
                        <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                            <label
                                htmlFor="newsletterEmailInput"
                                className="visually-hidden"
                            >
                                Email address
                            </label>
                            <input
                                id="newsletterEmailInput"
                                type="email"
                                className="form-control"
                                value={NewsletterEmail}
                                onChange={handleNewsletterValue}
                                placeholder="Email address"
                            />
                            <button className="btn btn-primary" type="submit">
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                <p>
                    ©{" "}
                    {new Date().getFullYear() +
                        " " +
                        process.env.NEXT_PUBLIC_APP_NAME}{" "}
                    , Inc. All rights reserved.
                </p>
                <ul className="list-unstyled d-flex">
                    <li className="ms-3">
                        <a className="link-dark" href="#">
                            <BsFacebook />
                        </a>
                    </li>
                    <li className="ms-3">
                        <a className="link-dark" href="#">
                            <FaSquareTwitter />
                        </a>
                    </li>
                    <li className="ms-3">
                        <a className="link-dark" href="#">
                            <FaProductHunt />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
