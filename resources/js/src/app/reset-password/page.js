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
                        <div class="form-group">
                            <label for="inputEmail4">New Password</label>
                            <input
                                type="password"
                                name="password"
                                class="form-control"
                                placeholder="New Password"
                            />
                        </div>
                        <div class="form-group my-3">
                            <label for="inputEmail4">Re-Type Password</label>
                            <input
                                type="password"
                                name="re_password"
                                class="form-control"
                                placeholder="Re-Type Password"
                            />
                        </div>
                        <div className="mt-2">
                            <button type="submit" class="btn btn-primary w-100">
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
