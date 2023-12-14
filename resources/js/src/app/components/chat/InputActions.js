import Image from "next/image";
import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { BsFileEarmarkMusic } from "react-icons/bs";
import { FaPlayCircle } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { ImAttachment, ImSpinner10 } from "react-icons/im";
import { IoMdSend } from "react-icons/io";

export default function InputActions({
    loading,
    setMessageType,
    setMessageFile,
    setFileViewer,
}) {
    const handleChangeMessageFile = (e, fileType) => {
        const file = e.target.files[0];
        var fileViewElement = "";

        setMessageFile(file);
        setMessageType(fileType);

        if (fileType === 2) {
            fileViewElement = (
                <Image
                    src={URL.createObjectURL(file)}
                    width="45px"
                    height="45px"
                    alt="sender file viewer"
                />
            );
        } else if (fileType === 4) {
            fileViewElement = (
                <span className="truncate-text">
                    <FaPlayCircle /> {file.name}
                </span>
            );
        } else if (fileType === 5) {
            fileViewElement = (
                <span className="truncate-text">
                    <ImAttachment /> {file.name}
                </span>
            );
        }
        setFileViewer(fileViewElement);
    };

    return (
        <>
            <div className="input-actions-container">
                <div className="chat-messages-container">
                    <label className="text-primary" for="fileUpload">
                        <ImAttachment />
                        <input
                            type="file"
                            onChange={(e) => handleChangeMessageFile(e, 5)}
                            id="fileUpload"
                            className="d-none"
                            name="message_file"
                            accept="application/pdf, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                    </label>
                    <label className="text-primary" for="musicUpload">
                        <BsFileEarmarkMusic />
                        <input
                            type="file"
                            onChange={(e) => handleChangeMessageFile(e, 4)}
                            id="musicUpload"
                            className="d-none"
                            accept=".mp3, .ogg"
                            name="message_file"
                        />
                    </label>
                    <label className="text-primary" for="imageUpload">
                        <FaRegImage />
                        <input
                            type="file"
                            onChange={(e) => handleChangeMessageFile(e, 2)}
                            id="imageUpload"
                            className="d-none"
                            accept=".jpg, .jpeg, .png, .gif"
                            name="message_file"
                        />
                    </label>
                    <Button type="submit" size="small">
                        {loading ? (
                            <ImSpinner10 className="icon-spin-1" />
                        ) : (
                            <IoMdSend />
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}
