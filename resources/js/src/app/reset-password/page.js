"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import axios from "axios";
import toastAlert from "../components/utilities/Alert";

const ResetPassword = ({ searchParams }) => {
    const initialValues = {
        token: null,
        password: "",
        password_confirmation: "",
    };
    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        if (!searchParams.token) {
            handleTokenNotExists();
        } else {
            setFormValues({ token: searchParams.token });
        }
    }, [searchParams]);

    const handleChangeValues = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        // Call reset-password API
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/auth/reset-password",
                formValues,
                {}
            )
            .then((response) => {
                // Check the response status
                if (response.data.status === 200) {
                    toastAlert(response.data.message, "success", 3000);
                    // Clear form formValues
                    setFormValues(initialValues);
                } else {
                    toastAlert(response.data.message, "error", 5000);
                }
            })
            .catch((error) => {
                toastAlert(error, "error");
            });
    };

    function handleTokenNotExists() {
        toastAlert("There's no token exists", "error", 5000);
    }

    return (
        <>
            <StudentTemplate>
                <div className="container">
                    <div className="login-form">
                        <h3>Reset Password</h3>
                        <p>
                            Please make sure to write a strong password that
                            you'll remember
                        </p>
                        <form method="POST" onSubmit={handleSubmitForm}>
                            <div className="form-group">
                                <label htmlFor="inputEmail4">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    disabled={formValues.token ? "" : "disabled"}
                                    value={formValues.password}
                                    onChange={handleChangeValues}
                                    className="form-control"
                                    placeholder="New Password"
                                />
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="inputEmail4">
                                    Re-Type Password
                                </label>
                                <input
                                    type="password"
                                    disabled={formValues.token ? "" : "disabled"}
                                    value={formValues.password_confirmation}
                                    onChange={handleChangeValues}
                                    name="password_confirmation"
                                    className="form-control"
                                    placeholder="Re-Type Password"
                                />
                            </div>
                            <div className="mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </StudentTemplate>
        </>
    );
};

export default ResetPassword;
