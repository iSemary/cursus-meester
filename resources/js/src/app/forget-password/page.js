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
                        <div class="form-group">
                            <label for="inputEmail4">Email</label>
                            <input
                                type="email"
                                class="form-control"
                                placeholder="Your Email Address"
                            />
                        </div>
                        <div class="form-group mt-3">
                            <button type="submit" class="btn btn-primary w-100">
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
