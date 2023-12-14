"use client";
import StudentTemplate from "../../Templates/StudentTemplate";
import React, { useEffect, useRef, useState } from "react";
import "intl-tel-input/build/css/intlTelInput.css";
// import intlTelInput from "intl-tel-input";
import toastAlert from "../../components/utilities/Alert";
import axios from "axios";
import { Token } from "../../components/utilities/Authentication/Token";
import { useRouter } from "next/navigation";
import { numbers } from "../../components/utilities/global/numbers";

const RegisterInstructor = () => {
    const initialValues = {
        full_name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        position: "",
        country_id: "",
        industry_id: "",
        organization_id: "",
        country_dial_code: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [countries, setCountries] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [organizations, setOrganizations] = useState([]);

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
                process.env.NEXT_PUBLIC_API_URL + "/auth/register/instructor",
                formValues,
                {}
            )
            .then((response) => {
                toastAlert(response.data.message, "success", 3000);
                // Clear form formValues
                setFormValues(initialValues);
                // Store Access token
                Token.store(response.data.data.user.access_token);
                // Navigate to home page
                router.push("/dashboard/");
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error");
            });
    };

    useEffect(() => {
        // const inputPhoneElement = inputPhoneRef.current;
        // const itiInstance = intlTelInput(inputPhoneElement, {
        //     initialCountry: "auto",
        //     geoIpLookup: function (callback) {
        //         fetch("https://ipapi.co/json")
        //             .then(function (res) {
        //                 return res.json();
        //             })
        //             .then(function (data) {
        //                 callback(data.country_code);
        //                 setFormValues({
        //                     ...formValues,
        //                     country_dial_code: data.country_calling_code,
        //                 });
        //             })
        //             .catch(function () {
        //                 callback("nl");
        //             });
        //     },
        // });

        // setIti(itiInstance);

        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/countries?all=true")
            .then((response) => {
                setCountries(response.data.data.countries);
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/industries?all=true")
            .then((response) => {
                setIndustries(response.data.data.industries);
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/organizations?all=true")
            .then((response) => {
                setOrganizations(response.data.data.organizations);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <StudentTemplate>
            <div className="container">
                <div className="register-form">
                    <h3>
                        Register and Join the Learning Revolution as one of the
                        greatest instructors on the world
                    </h3>
                    <hr />
                    <form method="POST" onSubmit={handleSubmitForm}>
                        <div className="form-group">
                            <label htmlFor="inputAddress">Full Name</label>
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
                            <div className="form-group col-6">
                                <label htmlFor="inputEmail4">Email</label>
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
                        </div>
                        <div className="row mt-2">
                            <div className="form-group col-6">
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
                            <div className="form-group col-6">
                                <label htmlFor="inputOrganization">
                                    Organization
                                </label>
                                <select
                                    id="inputOrganization"
                                    value={formValues.organization_id}
                                    name="organization_id"
                                    onChange={handleChangeValues}
                                    className="form-control"
                                >
                                    <option value="">
                                        Select your organization
                                    </option>
                                    {organizations &&
                                        organizations.map(
                                            (organization, index) => {
                                                return (
                                                    <option
                                                        value={organization.id}
                                                    >
                                                        {organization.name}
                                                    </option>
                                                );
                                            }
                                        )}
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
                        <div className="row mt-2">
                            <div className="form-group col-6">
                                <label htmlFor="inputIndustry">
                                    Industry you'll teach
                                </label>
                                <select
                                    id="inputIndustry"
                                    value={formValues.industry_id}
                                    name="industry_id"
                                    onChange={handleChangeValues}
                                    className="form-control"
                                >
                                    <option value="">
                                        Select your industry
                                    </option>
                                    {industries &&
                                        industries.map((industry, index) => {
                                            return (
                                                <option value={industry.id}>
                                                    {industry.title}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="form-group col-6">
                                <label htmlFor="inputPosition">Position</label>
                                <input
                                    type="text"
                                    id="inputPosition"
                                    name="position"
                                    value={formValues.position}
                                    className="form-control"
                                    onChange={handleChangeValues}
                                    placeholder="Your current position"
                                />
                            </div>
                        </div>
                        <div className="form-group my-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="gridCheck"
                                    required
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
