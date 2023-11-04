"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import "intl-tel-input/build/css/intlTelInput.css";
import intlTelInput from "intl-tel-input";
import toastAlert from "../components/utilities/Alert";
import axios from "axios";
import { Token } from "../components/utilities/Authentication/Token";
import { useRouter } from "next/navigation";
import { numbers } from "../components/utilities/global/numbers";

const Register = () => {
    const initialValues = {
        full_name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        country_id: "",
        country_dial_code: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [countries, setCountries] = useState([]);

    const [iti, setIti] = useState(null);
    const inputPhoneRef = useRef(null);

    const router = useRouter();

    const handleChangeValues = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
        if (name === "phone") {
            const selectedCountryData = iti.getSelectedCountryData();
            setFormValues({
                ...formValues,
                phone: numbers.extractNumbers(value),
                country_dial_code: selectedCountryData.dialCode,
            });
        }
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        // Call register API
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/auth/register",
                formValues,
                {}
            )
            .then((response) => {
                // Check the response status
                if (response.data.status === 200) {
                    toastAlert(response.data.message, "success", 3000);
                    // Clear form formValues
                    setFormValues(initialValues);
                    // Store Access token
                    Token.store(response.data.data.user.access_token);
                    // Navigate to home page
                    router.push("/");
                } else {
                    toastAlert(response.data.message, "error", 5000);
                }
            })
            .catch((error) => {
                toastAlert(error, "error");
            });
    };

    useEffect(() => {
        const inputPhoneElement = inputPhoneRef.current;
        const itiInstance = intlTelInput(inputPhoneElement, {
            initialCountry: "auto",
            geoIpLookup: function (callback) {
                fetch("https://ipapi.co/json")
                    .then(function (res) {
                        return res.json();
                    })
                    .then(function (data) {
                        callback(data.country_code);
                        setFormValues({
                            ...formValues,
                            country_dial_code: data.country_calling_code,
                        });
                    })
                    .catch(function () {
                        callback("nl");
                    });
            },
        });

        setIti(itiInstance);

        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/countries?all=true")
            .then((response) => {
                if (response.data.status === 200) {
                    setCountries(response.data.data.countries);
                }
            });
    }, []);

    return (
        <StudentTemplate>
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
                    <form method="POST" onSubmit={handleSubmitForm}>
                        <div className="form-group">
                            <label htmlFor="inputName">Full Name</label>
                            <input
                                type="text"
                                id="inputName"
                                name="full_name"
                                value={formValues.full_name}
                                className="form-control"
                                placeholder="Your full name"
                                onChange={handleChangeValues}
                            />
                        </div>
                        <div className="row mt-2">
                            <div className="form-group col-6">
                                <label htmlFor="inputEmail">Email</label>
                                <input
                                    type="email"
                                    id="inputEmail"
                                    name="email"
                                    value={formValues.email}
                                    className="form-control"
                                    placeholder="Your Email Address"
                                    onChange={handleChangeValues}
                                />
                            </div>
                            <div className="form-group col-6">
                                <label htmlFor="inputPhone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="inputPhone"
                                    ref={inputPhoneRef}
                                    placeholder=""
                                    name="phone"
                                    value={formValues.phone}
                                    className="form-control"
                                    onChange={handleChangeValues}
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="form-group">
                                <label htmlFor="inputCountry">Country</label>
                                <select
                                    id="inputCountry"
                                    value={formValues.country_id}
                                    name="country_id"
                                    onChange={handleChangeValues}
                                    className="form-control"
                                >
                                    <option value="">
                                        Select your country
                                    </option>
                                    {countries &&
                                        countries.map((country, index) => {
                                            return (
                                                <option value={country.id}>
                                                    {country.name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="form-group col-6 mt-2">
                                <label htmlFor="inputPassword">Password</label>
                                <input
                                    id="inputPassword"
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Your Password"
                                    value={formValues.password}
                                    onChange={handleChangeValues}
                                />
                            </div>
                            <div className="form-group col-6 mt-2">
                                <label htmlFor="inputConfirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    id="inputConfirmPassword"
                                    type="password"
                                    className="form-control"
                                    name="password_confirmation"
                                    placeholder="Your Password"
                                    value={formValues.password_confirmation}
                                    onChange={handleChangeValues}
                                />
                            </div>
                        </div>
                        <div className="form-group my-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agreeCheck"
                                    required
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="agreeCheck"
                                >
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
        </StudentTemplate>
    );
};

export default Register;
