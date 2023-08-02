import Image from "next/image";
import React from "react";

const Register = () => {
    return (
        <div className="container">
            <div className="register-form">
                <h3>
                    Welcome to Our eLearning Platform! Register and Join the
                    Learning Revolution
                </h3>

                <div className="third-register mx-auto text-center">
                    <a className="text-decoration-none">
                        <div className="mb-1 third-register-link">
                            <Image
                                src="/assets/images/icons/google.png"
                                width={25}
                                height={25}
                                alt="google login"
                            />
                            <span>Login With Google</span>
                        </div>
                    </a>
                    <a className="text-decoration-none">
                        <div className="mb-1 third-register-link">
                            <Image
                                src="/assets/images/icons/facebook.png"
                                width={25}
                                height={25}
                                alt="facebook login"
                            />
                            <span>Login With Facebook</span>
                        </div>
                    </a>
                    <a className="text-decoration-none">
                        <div className="mb-1 third-register-link">
                            <Image
                                src="/assets/images/icons/microsoft.png"
                                width={25}
                                height={25}
                                alt="microsoft login"
                            />
                            <span>Login With Microsoft</span>
                        </div>
                    </a>
                </div>
                <div className="my-2 text-center">-OR-</div>
                <form>
                    <div className="form-group">
                        <label htmlFor="inputAddress">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Your full name"
                        />
                    </div>
                    <div className="row mt-2">
                        <div className="form-group col-6">
                            <label htmlFor="inputEmail4">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Your Email Address"
                            />
                        </div>
                        <div className="form-group col-6">
                            <label htmlFor="inputPassword4">Phone Number</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="inputPassword4">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Your Password"
                        />
                    </div>
                    <div className="form-group my-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="gridCheck"
                            />
                            <label className="form-check-label" htmlFor="gridCheck">
                                I've read the terms and conditions
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
