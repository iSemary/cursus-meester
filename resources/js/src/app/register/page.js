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
                    <div class="form-group">
                        <label for="inputAddress">Full Name</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Your full name"
                        />
                    </div>
                    <div class="row mt-2">
                        <div class="form-group col-6">
                            <label for="inputEmail4">Email</label>
                            <input
                                type="email"
                                class="form-control"
                                placeholder="Your Email Address"
                            />
                        </div>
                        <div class="form-group col-6">
                            <label for="inputPassword4">Phone Number</label>
                            <input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group mt-2">
                        <label for="inputPassword4">Password</label>
                        <input
                            type="password"
                            class="form-control"
                            placeholder="Your Password"
                        />
                    </div>
                    <div class="form-group my-3">
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="gridCheck"
                            />
                            <label class="form-check-label" for="gridCheck">
                                I've read the terms and conditions
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
