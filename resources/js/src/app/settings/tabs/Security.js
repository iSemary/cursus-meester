import React, { useEffect, useRef, useState } from "react";
import { Col, FormGroup, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import toastAlert from "../../components/utilities/Alert";
import axiosConfig from "../../components/axiosConfig/axiosConfig";

export default function Security() {
    const initialValues = { password: "", password_confirmation: "" };
    const [changePassword, setChangePassword] = useState(initialValues);
    const [isTwoFactorAuthenticate, setTwoFactorAuthenticate] = useState(false);

    // Toggle Enable/Disable 2 factor authenticate
    const handleChangeTwoFactorAuthenticate = () => {
        axiosConfig
            .post("/auth/toggle-factor-authenticate")
            .then((response) => {
                if (response.data.status === 200) {
                    toastAlert("2FA updated successfully", "success");
                    setTwoFactorAuthenticate(!isTwoFactorAuthenticate);
                }
            });
    };
    // Logout other devices
    const handleLogoutOtherDevices = () => {
        Swal.fire({
            title: "Are you sure you want to logout other devices?",
            showCancelButton: true,
            confirmButtonText: "Logout other devices",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .post("/auth/logout", { type: 2 })
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
                    "Other devices has been logged out successfully",
                    "success"
                );
            }
        });
    };
    // Change password state values
    const handleChangePasswordEvent = (e) => {
        const { name, value } = e.target;
        setChangePassword({
            ...changePassword,
            [name]: value,
        });
    };
    // Change password form
    const handleSubmitForm = (e) => {
        e.preventDefault();
        axiosConfig
            .post("/auth/update-password", changePassword)
            .then((response) => {
                toastAlert(response.data.message, "success", 3000);
                // Clear form formValues
                setChangePassword(initialValues);
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error", 5000);
            });
    };

    useEffect(() => {
        axiosConfig.get("/user/profile").then((response) => {
            if (response.data.status === 200) {
                if (response.data.data.data.user.factor_authenticate) {
                    setTwoFactorAuthenticate(true);
                } else {
                    setTwoFactorAuthenticate(false);
                }
            }
        });
    }, []);
    return (
        <Card>
            <Card.Header>
                <Card.Title className="font-weight-bold">Security</Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="mt-3">
                    <form method="POST">
                        <FormGroup>
                            <Row>
                                <Col md="12">
                                    <Row>
                                        <Col md="8">
                                            <label htmlFor="">
                                                Logout from all other sessions
                                            </label>
                                        </Col>
                                        <Col md="4">
                                            <div className="text-right">
                                                <button
                                                    className="btn btn-secondary"
                                                    type="button"
                                                    onClick={
                                                        handleLogoutOtherDevices
                                                    }
                                                >
                                                    Logout other devices
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </FormGroup>
                    </form>
                </div>
                <hr />
                <div>
                    <form method="POST">
                        <FormGroup>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="twoAuthSwitch"
                                    onChange={handleChangeTwoFactorAuthenticate}
                                    checked={
                                        isTwoFactorAuthenticate ? "checked" : ""
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="twoAuthSwitch"
                                >
                                    Enable 2FA Authentication
                                </label>
                            </div>
                        </FormGroup>
                    </form>
                </div>
                <hr />
                <div>
                    <h6 className="font-weight-bold">Change Password</h6>
                    <form method="POST" onSubmit={handleSubmitForm}>
                        <Row>
                            <Col md={12}>
                                <FormGroup className="mt-2">
                                    <label htmlFor="">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        autoComplete="off"
                                        placeholder="Your new password"
                                        required
                                        value={changePassword.password}
                                        onChange={handleChangePasswordEvent}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup className="mt-2">
                                    <label htmlFor="">
                                        Re-type your new password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password_confirmation"
                                        autoComplete="off"
                                        placeholder="Your new password, again..."
                                        required
                                        value={
                                            changePassword.password_confirmation
                                        }
                                        onChange={handleChangePasswordEvent}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="text-right mt-3">
                            <button className="btn btn-primary" type="submit">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </Card.Body>
        </Card>
    );
}
