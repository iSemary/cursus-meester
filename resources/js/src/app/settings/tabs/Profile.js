"use client";
import React, { useEffect, useRef, useState } from "react";
import { Col, FormGroup, Row } from "react-bootstrap";
// import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import { BiUpload } from "react-icons/bi";
import Card from "react-bootstrap/Card";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import CountrySelector from "../../components/forms/CountrySelector";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import toastAlert from "../../components/utilities/Alert";na
import { Token } from "../../components/utilities/Authentication/Token";
import LanguageSelector from "../../components/forms/LanguageSelector";
import { numbers } from "../../components/utilities/global/numbers";
import Image from "next/image";

export default function Profile() {
    const router = useRouter();
    const [iti, setIti] = useState(null);
    const inputPhoneRef = useRef(null);
    const [newAvatarImage, setNewAvatarImage] = useState(null);
    const [newAvatar, setNewAvatar] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [profile, setProfile] = useState({});
    const [socialLinks, setSocialLinks] = useState(null);

    const verifyEmailBtnRef = useRef(null);
    const verifyPhoneBtnRef = useRef(null);

    useEffect(() => {
        // const inputPhoneElement = inputPhoneRef.current;
        // const itiInstance = intlTelInput(inputPhoneElement, {
        //     initialCountry: "NL",
        // });

        // Get Profile Details
        axiosConfig
            .get("/user/profile")
            .then((response) => {
                setUserDetails(response.data.data.data.user);
                setProfile(response.data.data.data.student_profile);
                setSocialLinks(response.data.data.data.social_links);

                // itiInstance.setNumber("+" + response.data.data.data.user.phone);
                // setIti(itiInstance);
            })
            .catch((error) => {
                console.error(error);
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
        const link = socialLinks.find(
            (link) => link?.link_type && link.link_type === id
        );
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
        if (name === "phone") {
            const selectedCountryData = iti.getSelectedCountryData();
            setUserDetails({
                ...userDetails,
                phone: numbers.extractNumbers(value),
                country_dial_code: selectedCountryData.dialCode,
            });
        }
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
    const handleChangeSocialLinks = (event, index) => {
        const updatedLinks = [...socialLinks];
        const existingLinkIndex = updatedLinks.findIndex(
            (link) => link.link_type === index
        );

        if (existingLinkIndex !== -1) {
            updatedLinks[existingLinkIndex].link_url = event.target.value;
        } else {
            updatedLinks.push({
                link_type: index,
                link_url: event.target.value,
            });
        }
        setSocialLinks(updatedLinks);
    };

    /** Save All Profile Settings */
    const handleSaveSettings = (e) => {
        e.preventDefault();
        // Preparing form data
        axiosConfig
            .post(
                "/student/profile",
                {
                    new_avatar: newAvatar,
                    ...userDetails,
                    ...profile,
                    social_links: socialLinks,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                toastAlert(response.data.message, "success");
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error");
            });
    };

    /** Handle Verify Email */
    const handleVerifyEmail = (e) => {
        verifyEmailBtnRef.current.disabled = true;
        verifyEmailBtnRef.current.innerText = "Verifying";
        axiosConfig
            .post("/auth/send/verify/email")
            .then((response) => {
                verifyEmailBtnRef.current.innerText = "Verify";
                toastAlert(response.data.message, "success");
            })
            .catch(({ response }) => {
                verifyEmailBtnRef.current.disabled = false;
                verifyEmailBtnRef.current.innerText = "Verify";
                toastAlert(response.data.message, "error");
            });
    };

    /** Handle Verify Phone */
    const handleVerifyPhone = () => {
        verifyPhoneBtnRef.current.disabled = true;
        verifyPhoneBtnRef.current.innerText = "Verifying";
        axiosConfig
            .post("/auth/send/otp")
            .then((response) => {
                verifyPhoneBtnRef.current.innerText = "Verify";
                toastAlert(response.data.message, "success");
                // Write and verify OTP code
                Swal.fire({
                    title: "Enter the OTP you recently received",
                    input: "number",
                    inputAttributes: {
                        autocapitalize: "off",
                    },
                    showCancelButton: true,
                    confirmButtonText: "Submit",
                    showLoaderOnConfirm: true,
                    preConfirm: async (otp) => {
                        return axiosConfig
                            .post("/auth/verify/otp", { otp: otp })
                            .then((response) => {
                                return response.data.message;
                            })
                            .catch((error) => {
                                Swal.showValidationMessage(
                                    `Something went wrong`
                                );
                            });
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                }).then((result) => {
                    if (result.isConfirmed) {
                        verifyPhoneBtnRef.current.innerText = "Verified";
                        toastAlert(
                            "Your phone number has been verified!",
                            "success"
                        );
                    }
                });
            })
            .catch(({ response }) => {
                verifyPhoneBtnRef.current.disabled = false;
                verifyPhoneBtnRef.current.innerText = "Verify";
                toastAlert(response.data.message, "error");
            });
    };

    /** Handle uploading avatar image */
    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        setNewAvatar(file);
        setNewAvatarImage(URL.createObjectURL(file));
    };
    return (
        <Card>
            <Card.Header>
                <Card.Title className="font-weight-bold">Profile</Card.Title>
            </Card.Header>
            <Card.Body>
                <form
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={handleSaveSettings}
                >
                    {/* Main Data */}
                    <Row>
                        <Col className="mb-2" md={12}>
                            <div className="position-relative w-fit-content">
                                <Image
                                    src={
                                        newAvatarImage
                                            ? newAvatarImage
                                            : profile.avatar
                                            ? profile.avatar
                                            : "/assets/images/icons/avatar.png"
                                    }
                                    width="150"
                                    height="150"
                                    className="avatar-image settings"
                                    alt="avatar"
                                />
                                <div className="upload-avatar">
                                    <label
                                        for="avatarUpload"
                                        className="custom-file-upload btn btn-primary btn-sm"
                                    >
                                        <BiUpload />
                                    </label>
                                    <input
                                        id="avatarUpload"
                                        onChange={handleAvatarUpload}
                                        type="file"
                                        name="new_avatar"
                                        accept="image/png, image/gif, image/jpg, image/jpeg"
                                    />
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
                                <label htmlFor="">Username</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name="username"
                                    onChange={handleChangeUserDetails}
                                    required
                                    value={userDetails?.username}
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
                                            ref={verifyEmailBtnRef}
                                            onClick={
                                                userDetails?.email_verified_at
                                                    ? ""
                                                    : handleVerifyEmail
                                            }
                                            type="button"
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
                                            ref={verifyPhoneBtnRef}
                                            onClick={
                                                userDetails?.phone_verified_at
                                                    ? ""
                                                    : handleVerifyPhone
                                            }
                                            type="button"
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
                                <LanguageSelector
                                    defaultValue={userDetails?.language_id}
                                    name="language_id"
                                    onChange={handleChangeUserDetails}
                                    id="languageId"
                                    required
                                />
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
                                    onChange={(e) =>
                                        handleChangeSocialLinks(e, 1)
                                    }
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
                                    onChange={(e) =>
                                        handleChangeSocialLinks(e, 2)
                                    }
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
                                    onChange={(e) =>
                                        handleChangeSocialLinks(e, 3)
                                    }
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
                                    onChange={(e) =>
                                        handleChangeSocialLinks(e, 4)
                                    }
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
                                    onChange={(e) =>
                                        handleChangeSocialLinks(e, 5)
                                    }
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
                                    onChange={(e) =>
                                        handleChangeSocialLinks(e, 6)
                                    }
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
