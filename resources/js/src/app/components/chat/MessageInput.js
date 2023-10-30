import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import InputActions from "./InputActions";
import { InputTextarea } from "primereact/inputtextarea";

export default function MessageInput() {
    const [WrittenMessage, setWrittenMessage] = useState(null);
    return (
        <div className="message-input-container">
            <Row>
                <Col md={9}>
                    <InputTextarea
                        value={WrittenMessage}
                        placeholder="What are you thinking?"
                        onChange={(e) => setWrittenMessage(e.target.value)}
                        className="no-shadows no-resize"
                    />
                </Col>
                <Col md={3} className="d-grid align-items-center">
                    <InputActions />
                </Col>
            </Row>
        </div>
    );
}
