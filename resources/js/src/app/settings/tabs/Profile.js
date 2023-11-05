"use client";
import React, { useEffect, useRef, useState } from "react";
import { Col, FormGroup, Row } from "react-bootstrap";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import { BiUpload } from "react-icons/bi";
import Card from "react-bootstrap/Card";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import CountrySelector from "../../components/forms/CountrySelector";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import toastAlert from "../../components/utilities/Alert";
import { Token } from "../../components/utilities/Authentication/Token";

export default function Profile() {
    const router = useRouter();
    const [iti, setIti] = useState(null);
    const inputPhoneRef = useRef(null);
    const [userDetails, setUserDetails] = useState({});
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const inputPhoneElement = inputPhoneRef.current;
        const itiInstance = intlTelInput(inputPhoneElement, {
            initialCountry: "NL",
        });

        // Get Profile Details
        axiosConfig.get("/user/profile").then((response) => {
            setUserDetails(response.data.data.data.user);
            setProfile(response.data.data.data.student_profile);

            itiInstance.setNumber("+" + response.data.data.data.user.phone);
            setIti(itiInstance);
        });
    }, []);

    const handleAccountDeactivation = () => {
        Swal.fire({
            title: "Are you sure you want to deactivate your account?",
            showCancelButton: true,
            confirmButtonText: "Deactivate",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .post("/auth/deactivate")
                    .then((response) => {
                        return true;
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Something went wrong`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                toastAlert(
                    "Your account has been deactivated, Will mess you!",
                    "success"
                );
                Token.explode();
                router.push("/");
            }
        });
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title className="font-weight-bold">Profile</Card.Title>
            </Card.Header>
            <Card.Body>
                <form method="POST" encType="multipart/form-data">
                    {/* Main Data */}
                    <Row>
                        <Col className="mb-2" md={12}>
                            <div className="position-relative w-fit-content">
                                <img
                                    src="https://github.com/mdo.png"
                                    className="avatar-image settings"
                                    alt="avatar"
                                />
                                <div className="upload-avatar">
                                    <button className="btn btn-primary btn-sm">
                                        <BiUpload />
                                    </button>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Full Name</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="full_name"
                                    required
                                    value={userDetails?.full_name}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Email</label>
                                <Row>
                                    <Col md={9}>
                                        <input
                                            type="email"
                                            autoComplete="off"
                                            className="form-control"
                                            name="email"
                                            required
                                            value={userDetails?.email}
                                        />
                                    </Col>
                                    <Col md={3} className="text-right">
                                        <button
                                            className={`btn btn-sm btn-${
                                                userDetails?.email_verified_at
                                                    ? "success"
                                                    : "primary"
                                            }`}
                                            disabled={
                                                userDetails?.email_verified_at
                                            }
                                        >
                                            {userDetails?.email_verified_at
                                                ? "Verified"
                                                : "Verify"}
                                        </button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Phone</label>
                                <br />
                                <Row>
                                    <Col md={9}>
                                        <input
                                            type="tel"
                                            id="inputPhone"
                                            ref={inputPhoneRef}
                                            placeholder=""
                                            name="phone"
                                            value={userDetails?.phone}
                                            className="form-control w-100"
                                        />
                                    </Col>
                                    <Col md={3} className="text-right">
                                        <button
                                            className={`btn btn-sm btn-${
                                                userDetails?.phone_verified_at
                                                    ? "success"
                                                    : "primary"
                                            }`}
                                            disabled={
                                                userDetails?.phone_verified_at
                                            }
                                        >
                                            {userDetails?.phone_verified_at
                                                ? "Verified"
                                                : "Verify"}
                                        </button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="country_id">Country</label>
                                <CountrySelector
                                    defaultValue={userDetails?.country_id}
                                    name="country_id"
                                    id="countryId"
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Language</label>
                                <select className="form-control">
                                    <option value="">Select Language</option>
                                </select>
                            </FormGroup>
                        </Col>
                    </Row>
                    <hr />
                    <h6 className="font-weight-bold">Student Profile</h6>
                    {/* Student Data */}
                    <Row className="mt-3">
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Position</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="position"
                                    value={profile?.position}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Bio</label>
                                <textarea
                                    rows="5"
                                    cols="15"
                                    name="bio"
                                    value={profile?.bio}
                                    className="form-control"
                                ></textarea>
                            </FormGroup>
                        </Col>
                    </Row>
                    {/* Social Links Data */}
                    <hr />
                    <h6 className="font-weight-bold">Social Links</h6>
                    <Row>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Github</label>
                                <input
                                    type="url"
                                    placeholder=""
                                    name="social_link[1]"
                                    className="form-control"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Stackoverflow</label>
                                <input
                                    type="url"
                                    placeholder=""
                                    name="social_link[2]"
                                    className="form-control"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Facebook</label>
                                <input
                                    type="url"
                                    placeholder=""
                                    name="social_link[3]"
                                    className="form-control"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Twitter</label>
                                <input
                                    type="url"
                                    placeholder=""
                                    name="social_link[4]"
                                    className="form-control"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Linkedin</label>
                                <input
                                    type="url"
                                    placeholder=""
                                    name="social_link[4]"
                                    className="form-control"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="text-right mt-3">
                        <button
                            className="btn btn-primary"
                            style={{ width: "150px" }}
                        >
                            Save
                        </button>
                    </div>
                </form>
                <hr />
                <Row>
                    <Col md={12}>
                        <h6 className="font-weight-bold">
                            Account Deactivation
                        </h6>
                        <button
                            type="button"
                            onClick={handleAccountDeactivation}
                            className="btn btn-danger"
                        >
                            Deactivate your account
                        </button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}
