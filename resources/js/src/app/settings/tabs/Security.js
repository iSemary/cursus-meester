import React, { useEffect, useRef, useState } from "react";
import { Col, FormGroup, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";

export default function Security() {
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
                                            <label for="">
                                                Logout from all other sessions
                                            </label>
                                        </Col>
                                        <Col md="4">
                                            <div className="text-right">
                                                <button
                                                    className="btn btn-secondary"
                                                    type="submit"
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
                            <div class="form-check form-switch">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckChecked"
                                    checked
                                />
                                <label
                                    class="form-check-label"
                                    for="flexSwitchCheckChecked"
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
                    <form method="POST">
                        <Row>
                            <Col md={12}>
                                <FormGroup className="mt-2">
                                    <label htmlFor="">New Password</label>
                                    <input
                                        type="password"
                                        autoComplete="off"
                                        className="form-control"
                                        name="password"
                                        required
                                        value=""
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
                                        autoComplete="off"
                                        className="form-control"
                                        name="password_confirmation"
                                        required
                                        value=""
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="text-right mt-3">
                            <button className="btn btn-primary">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </Card.Body>
        </Card>
    );
}
