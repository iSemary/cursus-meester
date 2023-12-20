"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import "intl-tel-input/build/css/intlTelInput.css";
import toastAlert from "../components/utilities/Alert";
import axios from "axios";
import { Token } from "../components/utilities/Authentication/Token";
import { useRouter } from "next/navigation";
import { numbers } from "../components/utilities/global/numbers";
import IntlTelInput from "react-intl-tel-input-18";
import "react-intl-tel-input-18/dist/main.css";
import Cookies from "js-cookie";
import googleIco from "/public/assets/images/icons/google.png";
import facebookIco from "/public/assets/images/icons/facebook.png";
import linkedinIco from "/public/assets/images/icons/linkedin.png";

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

    const router = useRouter();

    const handleChangePhoneNumber = (
        isValid,
        value,
        selectedCountryData,
        fullNumber,
        extension
    ) => {
        setFormValues({
            ...formValues,
            phone: numbers.extractNumbers(value),
            country_dial_code: selectedCountryData.iso2,
        });
    };

    const handleChangeValues = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
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
                    window.location.href = "/";
                } else {
                    toastAlert(response.data.message, "error", 5000);
                }
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error");
            });
    };

    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/countries?all=true")
            .then((response) => {
                setCountries(response.data.data.countries);
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .get("https://ipapi.co/json")
            .then((response) => {
                setFormValues({
                    ...formValues,
                    country_dial_code: response.data.country_code,
                });
            })
            .catch(function () {
                setFormValues({ ...formValues, country_dial_code: "nl" });
            });
    }, []);

    const handleSocialRegister = (socialName) => {
        let windowWidth = 500;
        let windowHeight = 600;

        // Calculate the center position for the new window
        let windowLeft = window.screen.width / 2 - windowWidth / 2;
        let windowTop = window.screen.height / 2 - windowHeight / 2;

        let registerWindow = window.open(
            process.env.NEXT_PUBLIC_URL + "/auth/" + socialName,
            "Register Window",
            "width=" +
                windowWidth +
                ",height=" +
                windowHeight +
                ",left=" +
                windowLeft +
                ",top=" +
                windowTop
        );

        const checkClosed = setInterval(() => {
            if (registerWindow.closed) {
                clearInterval(checkClosed);
                const authToken = Cookies.get("AUTH_TOKEN");
                if (authToken) {
                    nextLogin(authToken);
                } else {
                    toastAlert("Invalid login.", "error");
                }
            }
        }, 1000);
    };

    const nextLogin = (authToken) => {
        toastAlert("Logged in successfully!", "success", 3000);
        // Navigate to home page
        window.location.href = "/";
    };

    return (
        <StudentTemplate>
            <div className="container">
                <div className="register-form">
                    <h3>
                        Welcome to Our eLearning Platform! Register and Join the
                        Learning Revolution
                    </h3>

                    <div className="d-grid third-register mx-auto text-center">
                        <button
                            className="btn"
                            onClick={() => handleSocialRegister("google")}
                        >
                            <div className="mb-1 third-register-link">
                                <Image
                                    src={googleIco}
                                    width={25}
                                    height={25}
                                    alt="google login"
                                />
                                <span>Login With Google</span>
                            </div>
                        </button>
                        <button
                            className="btn"
                            onClick={() => handleSocialRegister("facebook")}
                        >
                            <div className="mb-1 third-register-link">
                                <Image
                                    src={facebookIco}
                                    width={25}
                                    height={25}
                                    alt="facebook login"
                                />
                                <span>Login With Facebook</span>
                            </div>
                        </button>
                        <button
                            className="btn"
                            onClick={() => handleSocialRegister("linkedin")}
                        >
                            <div className="mb-1 third-register-link">
                                <Image
                                    src={linkedinIco}
                                    width={25}
                                    height={25}
                                    alt="microsoft login"
                                />
                                <span>Login With Linkedin</span>
                            </div>
                        </button>
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
                                <IntlTelInput
                                    id="inputPhone"
                                    autoPlaceholder
                                    containerClassName="intl-tel-input"
                                    inputClassName="form-control"
                                    fieldName="phone"
                                    defaultCountry={formValues?.country_dial_code?.toLowerCase()}
                                    value={formValues.phone}
                                    onPhoneNumberChange={
                                        handleChangePhoneNumber
                                    }
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
