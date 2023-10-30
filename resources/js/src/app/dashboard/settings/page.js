"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import { Row, Col, FormGroup } from "react-bootstrap";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export default function Settings() {
    const [Settings, setSettings] = useState({
        name: "Abdelrahman",
        email: "abdelrahman@gmail.com",
        phone: "20102012337",
        country_id: "1",
        position: "Full Stack Developer",
        organization_id: "1",
        industry_id: "1",
        bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        avatar: "https://github.com/mdo.png",
    });
    const countries = [
        { label: "Country 1", value: "1" },
        { label: "Country 2", value: "2" },
    ];

    const organizations = [
        { label: "Organization 1", value: "1" },
        { label: "Organization 2", value: "2" },
    ];

    const industries = [
        { label: "Industry 1", value: "1" },
        { label: "Industry 2", value: "2" },
    ];

    const saveSettings = () => {
    };

    return (
        <DashboardTemplate>
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md={3}>
                            {/* <Image
                                width={150}
                                height={150}
                                src={"https://github.com/mdo.png"}
                                alt="profile"
                            /> */}
                        </Col>
                        <Col md={9}>
                            <Row>
                                <Col md={6} className="mt-2">
                                    <FormGroup>
                                        <label>Name</label>
                                        <InputText
                                            value={Settings.name}
                                            className="w-100"
                                            placeholder="Name"
                                            onChange={(e) =>
                                                setSettings({
                                                    ...Settings,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <FormGroup>
                                        <label>Email</label>
                                        <InputText
                                            value={Settings.email}
                                            placeholder="Email"
                                            className="w-100"
                                            onChange={(e) =>
                                                setSettings({
                                                    ...Settings,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="mt-2">
                                    <FormGroup>
                                        <label>Phone</label>
                                        <InputText
                                            className="w-100"
                                            value={Settings.phone}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...Settings,
                                                    phone: e.target.value,
                                                })
                                            }
                                            placeholder="Phone"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <FormGroup>
                                        <label>Country</label>
                                        <Dropdown
                                            className="w-100"
                                            value={Settings.country}
                                            options={countries}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...Settings,
                                                    country: e.value,
                                                })
                                            }
                                            placeholder="Country"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
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
                                    value={Settings.position}
                                    onChange={(e) =>
                                        setSettings({
                                            ...Settings,
                                            position: e.target.value,
                                        })
                                    }
                                    placeholder="Position"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4} className="mt-2">
                            <FormGroup>
                                <label>Organization</label>
                                <Dropdown
                                    className="w-100"
                                    value={Settings.organization}
                                    options={organizations}
                                    onChange={(e) =>
                                        setSettings({
                                            ...Settings,
                                            organization: e.value,
                                        })
                                    }
                                    placeholder="Organization"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4} className="mt-2">
                            <FormGroup>
                                <label>Industry</label>
                                <Dropdown
                                    className="w-100"
                                    value={Settings.industry}
                                    options={industries}
                                    onChange={(e) =>
                                        setSettings({
                                            ...Settings,
                                            industry: e.value,
                                        })
                                    }
                                    placeholder="Industry"
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4} className="mt-2">
                            <FormGroup>
                                <label>Summary</label>
                                <InputTextarea
                                    className="w-100"
                                    value={Settings.bio}
                                    onChange={(e) =>
                                        setSettings({
                                            ...Settings,
                                            bio: e.target.value,
                                        })
                                    }
                                    placeholder="Bio"
                                    rows={6}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className="text-right">
                <Button label="Save" onClick={saveSettings} />
            </div>
        </DashboardTemplate>
    );
}
