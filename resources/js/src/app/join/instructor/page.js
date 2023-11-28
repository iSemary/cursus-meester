"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../../Templates/StudentTemplate";
import axios from "axios";
import toastAlert from "../../components/utilities/Alert";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { useRouter } from "next/navigation";
// This page for logged-in students who want to join as instructors
// so they won't redirected to the register form, they will just complete the missing part to create their instructor profile
export default function joinInstructor() {
    const router = useRouter();
    const [formValues, setFormValues] = useState({});
    const [industries, setIndustries] = useState([]);
    const [organizations, setOrganizations] = useState([]);

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
        axiosConfig
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/auth/join/instructor",
                formValues,
                {}
            )
            .then((response) => {
                // Check the response status
                toastAlert(response.data.message, "success", 3000);
                // Navigate to home page
                router.push("/dashboard/");
            })
            .catch(({ response }) => {
                if (response?.data?.message)
                    toastAlert(response.data.message, "error");
            });
    };

    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/industries?all=true")
            .then((response) => {
                setIndustries(response.data.data.industries);
            });
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/organizations?all=true")
            .then((response) => {
                setOrganizations(response.data.data.organizations);
            });
    }, []);

    return (
        <StudentTemplate>
            <div className="container">
                <div className="register-form">
                    <h3>
                        Complete your instructor profile and Join the Learning
                        Revolution as one of the greatest instructors on the
                        world
                    </h3>
                    <hr />
                    <form method="POST" onSubmit={handleSubmitForm}>
                        <div className="row my-2">
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
                            <div className="form-group col-12">
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
                        <button type="submit" className="btn btn-primary w-100">
                            Join
                        </button>
                    </form>
                </div>
            </div>
        </StudentTemplate>
    );
}
