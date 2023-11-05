"use client";
import React, { useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import toastAlert from "../components/utilities/Alert";
import axios from "axios";

const ForgetPassword = () => {
    const initialValues = {
        email: "",
    };
    const [formValues, setFormValues] = useState(initialValues);

    const handleChangeValues = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        // Call forgot-password API
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/auth/forget-password",
                formValues,
                {}
            )
            .then((response) => {
                toastAlert(response.data.message, "success", 3000);
                // Clear form formValues
                setFormValues(initialValues);
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error", 5000);
            });
    };

    return (
        <>
            <StudentTemplate>
                <div className="container">
                    <div className="login-form">
                        <h3>Forget your password?</h3>
                        <p>
                            Don't worry! We'll send you an email to reset your
                            password.
                        </p>
                        <form method="POST" onSubmit={handleSubmitForm}>
                            <div className="form-group">
                                <label htmlFor="inputEmail4">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formValues.email}
                                    className="form-control"
                                    onChange={handleChangeValues}
                                    placeholder="Your Email Address"
                                />
                            </div>
                            <div className="form-group mt-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Forget Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </StudentTemplate>
        </>
    );
};

export default ForgetPassword;
