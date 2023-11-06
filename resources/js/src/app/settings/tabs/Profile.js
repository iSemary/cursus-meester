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
    const [socialLinks, setSocialLinks] = useState(null);

    useEffect(() => {
        const inputPhoneElement = inputPhoneRef.current;
        const itiInstance = intlTelInput(inputPhoneElement, {
            initialCountry: "NL",
        });

        // Get Profile Details
        axiosConfig.get("/user/profile").then((response) => {
            setUserDetails(response.data.data.data.user);
            setProfile(response.data.data.data.student_profile);
            setSocialLinks(response.data.data.data.social_links);

            itiInstance.setNumber("+" + response.data.data.data.user.phone);
            setIti(itiInstance);
        });
    }, []);

    /** Deactivate account */
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

    /** Get Social Link By ID */
    const getSocialLink = (id) => {
        const link = socialLinks.find((link) => link.link_type === id);
        if (link) {
            return link.link_url;
        }
    };

    /** Change User Details State */
    const handleChangeUserDetails = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value,
        });
    };

    /** Change Profile State */
    const handleChangeProfile = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    /** Change Social Links State */
    const handleChangeSocialLinks = (e) => {
        const { name, value } = e.target;
        const match = name.match(/\[(\d+)\]/);
        const linkType = match[1];
        setSocialLinks((socialLinks) => {
            return socialLinks.map((link) =>
                link.link_type === linkType
                    ? { ...link, link_url: value }
                    : link
            );
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
                                    onChange={handleChangeUserDetails}
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
                                            onChange={handleChangeUserDetails}
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
                                            onChange={handleChangeUserDetails}
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
                                    onChange={handleChangeUserDetails}
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
                                    onChange={handleChangeProfile}
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
                                    onChange={handleChangeProfile}
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
                                    onChange={handleChangeSocialLinks}
                                    className="form-control"
                                    value={socialLinks && getSocialLink(1)}
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
                                    onChange={handleChangeSocialLinks}
                                    className="form-control"
                                    value={socialLinks && getSocialLink(2)}
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
                                    onChange={handleChangeSocialLinks}
                                    className="form-control"
                                    value={socialLinks && getSocialLink(3)}
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
                                    onChange={handleChangeSocialLinks}
                                    className="form-control"
                                    value={socialLinks && getSocialLink(4)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Linkedin</label>
                                <input
                                    type="url"
                                    placeholder=""
                                    name="social_link[5]"
                                    onChange={handleChangeSocialLinks}
                                    className="form-control"
                                    value={socialLinks && getSocialLink(5)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="mt-2">
                                <label htmlFor="">Website</label>
                                <input
                                    type="url"
                                    placeholder=""
                                    name="social_link[6]"
                                    onChange={handleChangeSocialLinks}
                                    className="form-control"
                                    value={socialLinks && getSocialLink(6)}
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
