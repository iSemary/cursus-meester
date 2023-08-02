import React from "react";

const ForgetPassword = () => {
    return (
        <>
            <div className="container">
                <div className="login-form">
                    <h3>Forget your password?</h3>
                    <p>
                        Don't worry! We'll send you an email to reset your
                        password.
                    </p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="inputEmail4">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Your Email Address"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary w-100">
                                Forget Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgetPassword;
