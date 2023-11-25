"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import axios from "axios";
import toastAlert from "../components/utilities/Alert";
import { useRouter } from "next/navigation";
import { Token } from "../components/utilities/Authentication/Token";
import Cookies from "js-cookie";

const Login = () => {
    const initialValues = {
        email: "",
        password: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const router = useRouter();

    const handleChangeValues = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        // Call login API
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/auth/login",
                formValues,
                {}
            )
            .then((response) => {
                toastAlert(response.data.message, "success", 3000);
                // Clear form formValues
                setFormValues(initialValues);
                // Store Access token
                Token.store(response.data.data.user.access_token);
                // Navigate to home page
                router.push("/");
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error", 5000);
            });
    };

    const handleSocialLogin = (socialName) => {
        let windowWidth = 500;
        let windowHeight = 600;

        // Calculate the center position for the new window
        let windowLeft = window.screen.width / 2 - windowWidth / 2;
        let windowTop = window.screen.height / 2 - windowHeight / 2;

        let loginWindow = window.open(
            process.env.NEXT_PUBLIC_URL + "/auth/" + socialName,
            "Register Window",
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
            if (loginWindow.closed) {
                clearInterval(checkClosed);
                const authToken = Cookies.get("AUTH_TOKEN");
                if (authToken) {
                    nextLogin(authToken);
                } else {
                    toastAlert("Invalid login.", "error");
                }
            }
        }, 1000);
    };

    const nextLogin = (authToken) => {
        toastAlert("Logged in successfully!", "success", 3000);
        // Navigate to home page
        router.push("/");
    };

    return (
        <>
            <StudentTemplate>
                <div className="container">
                    <div className="login-form">
                        <h3>
                            Welcome Back! Log in to Continue Your Learning
                            Adventure
                        </h3>
                        <form method="POST" onSubmit={handleSubmitForm}>
                            <div className="form-group">
                                <label htmlFor="inputEmail">Email</label>
                                <input
                                    id="inputEmail"
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Your Email Address"
                                    onChange={handleChangeValues}
                                    value={formValues.email}
                                />
                            </div>
                            <div className="form-group my-2">
                                <label htmlFor="inputPassword">Password</label>
                                <input
                                    id="inputPassword"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Your Password"
                                    onChange={handleChangeValues}
                                    value={formValues.password}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                    <div className="third-login mx-auto text-center">
                        <button
                            className="btn"
                            onClick={() => handleSocialLogin("google")}
                        >
                            <Image
                                src="/assets/images/icons/google.png"
                                width={40}
                                height={40}
                                alt="google login"
                            />
                        </button>
                        <button
                            className="btn"
                            onClick={() => handleSocialLogin("facebook")}
                        >
                            <Image
                                src="/assets/images/icons/facebook.png"
                                width={40}
                                height={40}
                                alt="facebook login"
                            />
                        </button>
                        <button
                            className="btn"
                            onClick={() => handleSocialLogin("linkedin")}
                        >
                            <Image
                                src="/assets/images/icons/linkedin.png"
                                width={40}
                                height={40}
                                alt="linkedin login"
                            />
                        </button>
                    </div>
                    <div className="text-center">
                        <Link
                            href="forget-password"
                            className="main-link f-size-20"
                        >
                            Forget your password?
                        </Link>
                    </div>
                    <hr className="w-50 mx-auto" />
                    <div className="text-center">
                        Don't have an account?{" "}
                        <Link href="/register" className="main-link border-0">
                            Register Now
                        </Link>
                    </div>
                </div>
            </StudentTemplate>
        </>
    );
};

export default Login;
