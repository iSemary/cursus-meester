"use client";
import React, { useState, useEffect } from "react";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import { Row, Col, FormGroup } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { BiUpload } from "react-icons/bi";
import toastAlert from "../../components/utilities/Alert";
import Image from "next/image";

export default function Settings() {
    const initialState = {
        bio: "",
        position: "",
        industry_id: "",
        organization_id: "",
        avatar: null,
    };
    const [newAvatarImage, setNewAvatarImage] = useState(null);
    const [newAvatar, setNewAvatar] = useState(null);
    const [profile, setProfile] = useState(initialState);

    const [organizations, setOrganizations] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    const [industries, setIndustries] = useState([]);

    /** Change Instructor Profile */
    const handleChangeProfile = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value,
        });
    };

    /** Handle uploading avatar image */
    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        setNewAvatar(file);
        setNewAvatarImage(URL.createObjectURL(file));
    };

    // Get essential data
    useEffect(() => {
        // Get Profile Details
        axiosConfig.get("/user/profile").then((response) => {
            setProfile(response.data.data.data.instructor_profile);
        });
        // Get Organizations
        axiosConfig.get("/organizations?all=true").then((response) => {
            setOrganizations(response.data.data.organizations);
        });
        // Get Industries
        axiosConfig.get("/industries?all=true").then((response) => {
            setIndustries(response.data.data.industries);
        });
    }, []);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormLoading(true);
        axiosConfig
            .post(
                "/instructor/profile",
                {
                    new_avatar: newAvatar,
                    ...profile,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                setFormLoading(false);
                toastAlert(response.data.message, "success");
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    return (
        <DashboardTemplate>
            <form
                method="POST"
                encType="multipart/form-data"
                onSubmit={handleSubmitForm}
            >
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={3}>
                                <div className="position-relative w-fit-content">
                                    <Image
                                        src={
                                            newAvatarImage
                                                ? newAvatarImage
                                                : profile.avatar
                                                ? profile.avatar
                                                : process.env.NEXT_PUBLIC_URL +
                                                  "/storage/users/avatar/default.png"
                                        }
                                        className="avatar-image settings"
                                        height={"150px"}
                                        width={"150px"}
                                        alt="avatar"
                                    />
                                    <div className="upload-avatar">
                                        <label
                                            htmlFor="avatarUpload"
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
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col md={12}>
                        <Row>
                            <Col md={4} className="mt-2">
                                <FormGroup>
                                    <label>Position</label>
                                    <InputText
                                        className="w-100"
                                        value={profile.position}
                                        onChange={handleChangeProfile}
                                        placeholder="Position"
                                        name="position"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4} className="mt-2">
                                <FormGroup>
                                    <label>Organization</label>
                                    <Dropdown
                                        className="w-100"
                                        value={profile.organization_id}
                                        options={organizations}
                                        onChange={handleChangeProfile}
                                        name="organization_id"
                                        placeholder="Organization"
                                        optionLabel="name"
                                        optionValue="id"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4} className="mt-2">
                                <FormGroup>
                                    <label>Industry</label>
                                    <Dropdown
                                        className="w-100"
                                        value={profile.industry_id}
                                        options={industries}
                                        onChange={handleChangeProfile}
                                        name="industry_id"
                                        placeholder="Industry"
                                        optionLabel="title"
                                        optionValue="id"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12} className="mt-2">
                                <FormGroup>
                                    <label>Summary</label>
                                    <InputTextarea
                                        className="w-100"
                                        value={profile.bio}
                                        onChange={handleChangeProfile}
                                        name="bio"
                                        placeholder="Bio"
                                        rows={6}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="mt-2 text-right">
                    <Button label="Save" type="submit" loading={formLoading} />
                </div>
            </form>
        </DashboardTemplate>
    );
}
