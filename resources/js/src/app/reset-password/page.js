import React from "react";

const ResetPassword = () => {
    return (
        <>
            <div className="container">
                <div className="login-form">
                    <h3>Reset Password</h3>
                    <p>
                        Please make sure to write a strong password that you'll
                        remember
                    </p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="inputEmail4">New Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="New Password"
                            />
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="inputEmail4">Re-Type Password</label>
                            <input
                                type="password"
                                name="re_password"
                                className="form-control"
                                placeholder="Re-Type Password"
                            />
                        </div>
                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary w-100">
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
