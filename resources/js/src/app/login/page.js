import Link from "next/link";
import Image from "next/image";
import React from "react";

const Login = () => {
    return (
        <>
            <div className="container">
                <div className="login-form">
                    <h3>
                        Welcome Back! Log in to Continue Your Learning Adventure
                    </h3>
                    <form>
                        <div class="form-group">
                            <label for="inputEmail4">Email</label>
                            <input
                                type="email"
                                class="form-control"
                                placeholder="Your Email Address"
                            />
                        </div>
                        <div class="form-group my-2">
                            <label for="inputPassword4">Password</label>
                            <input
                                type="password"
                                class="form-control"
                                placeholder="Your Password"
                            />
                        </div>
                        <button type="submit" class="btn btn-primary w-100">
                            Login
                        </button>
                    </form>
                </div>
                <div className="third-login mx-auto text-center">
                    <a>
                        <Image
                            src="/assets/images/icons/google.png"
                            width={40}
                            height={40}
                            alt="google login"
                        />
                    </a>
                    <a>
                        <Image
                            src="/assets/images/icons/facebook.png"
                            width={40}
                            height={40}
                            alt="facebook login"
                        />
                    </a>
                    <a>
                        <Image
                            src="/assets/images/icons/microsoft.png"
                            width={40}
                            height={40}
                            alt="microsoft login"
                        />
                    </a>
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
                    <Link href="register" className="main-link border-0">
                        Register Now
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Login;
