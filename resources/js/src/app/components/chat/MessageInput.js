import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import InputActions from "./InputActions";
import { InputTextarea } from "primereact/inputtextarea";
import axiosConfig from "../axiosConfig/axiosConfig";
import { FaRegTrashAlt } from "react-icons/fa";

export default function MessageInput({ conversationId }) {
    const [writtenMessage, setWrittenMessage] = useState("");
    const [messageType, setMessageType] = useState(1);
    const [messageFile, setMessageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [fileViewer, setFileViewer] = useState(null);

    const handleSendMessage = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("conversation_id", conversationId);
        formData.append("message_text", writtenMessage);
        formData.append("message_type", messageType);
        if (messageFile) formData.append("message_file", messageFile);

        axiosConfig
            .post("chat/send", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setLoading(false);
                setWrittenMessage("");
                setMessageType(1);
                setMessageFile(null);
                setFileViewer(null);
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    const handleRemoveFile = (e) => {
        setMessageType(1);
        setMessageFile(null);
        setFileViewer(null);
    };

    return (
        <div className="message-input-container">
            <form method="POST" onSubmit={handleSendMessage}>
                <Row>
                    <Col md={9}>
                        {fileViewer ? (
                            <Row className="mb-2">
                                <Col md={9}>{fileViewer}</Col>
                                <Col md={3}>
                                    <Button
                                        variant="danger"
                                        onClick={(e) => handleRemoveFile()}
                                    >
                                        <FaRegTrashAlt />
                                    </Button>
                                </Col>
                            </Row>
                        ) : (
                            ""
                        )}
                        <InputTextarea
                            value={writtenMessage}
                            name="message_text"
                            placeholder="What are you thinking?"
                            onChange={(e) => setWrittenMessage(e.target.value)}
                            className="no-shadows no-resize"
                        />
                    </Col>
                    <Col md={3} className="d-grid align-items-center">
                        <InputActions
                            loading={loading}
                            setMessageType={setMessageType}
                            setMessageFile={setMessageFile}
                            setFileViewer={setFileViewer}
                        />
                    </Col>
                </Row>
            </form>
        </div>
    );
}
