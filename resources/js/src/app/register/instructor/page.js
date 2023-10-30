import React from "react";
import StudentTemplate from "../../Templates/StudentTemplate";

const RegisterInstructor = () => {
    const industries = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    return (
        <StudentTemplate>
            <div className="container">
                <div className="register-form">
                    <h3>
                        Register and Join the Learning Revolution as one of the
                        greatest instructors on the world
                    </h3>
                    <hr />
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
                                <label htmlFor="inputPassword4">
                                    Phone Number
                                </label>
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
                        <div className="form-group mt-2">
                            <label htmlFor="">Industry you'll teach</label>
                            <select className="form-control">
                                <option>IT & Development</option>
                                <option>Design</option>
                                <option>Art</option>
                            </select>
                        </div>
                        <div className="form-group my-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="gridCheck"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="gridCheck"
                                >
                                    I've read the terms and conditions
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Join
                        </button>
                    </form>
                </div>
            </div>
        </StudentTemplate>
    );
};

export default RegisterInstructor;
