"use client";
import React, { useState } from "react";
import { FaStackOverflow, FaLinkedinIn } from "react-icons/fa6";
import toastAlert from "../components/utilities/Alert";
import axios from "axios";
import Link from "next/link";
import { IoLogoGithub } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";

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
            <hr />
            <div className="row">
                <div className="col-lg-6 col-md-4 col-6 mb-3">
                    <h5>Get Started</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <Link
                                className="nav-link p-0 text-muted"
                                href="/login"
                            >
                                Login
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link
                                className="nav-link p-0 text-muted"
                                href="/register"
                            >
                                Register
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link
                                className="nav-link p-0 text-muted"
                                href="/register/instructor"
                            >
                                Register as instructor
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="col-lg-6 col-md-4 col-12 mb-3">
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
                        <a
                            className="link-dark"
                            target="_blank"
                            href="https://www.abdelrahman.online/"
                        >
                            <AiOutlineGlobal />
                        </a>
                    </li>
                    <li className="ms-3">
                        <a
                            className="link-dark"
                            target="_blank"
                            href="https://github.com/iSemary"
                        >
                            <IoLogoGithub />
                        </a>
                    </li>
                    <li className="ms-3">
                        <a
                            className="link-dark"
                            target="_blank"
                            href="https://www.linkedin.com/in/isemary/"
                        >
                            <FaLinkedinIn />
                        </a>
                    </li>
                    <li className="ms-3">
                        <a
                            className="link-dark"
                            target="_blank"
                            href="https://stackoverflow.com/users/9735658/abdelrahman"
                        >
                            <FaStackOverflow />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
