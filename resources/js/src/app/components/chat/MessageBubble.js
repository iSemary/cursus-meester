import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdCloudDownload } from "react-icons/md";

export default function MessageBubble({ message }) {
    const [messageViewer, setMessageViewer] = useState("");

    const TYPE_TEXT = 1;
    const TYPE_IMAGE = 2;
    const TYPE_VIDEO = 3;
    const TYPE_VOICE = 4;
    const TYPE_FILE = 5;

    const handleMessageFileViewer = (message) => {
        switch (message.message_type_id) {
            case TYPE_TEXT:
                setMessageViewer("");
                break;
            case TYPE_IMAGE:
                setMessageViewer(
                    <Image
                        src={message.message}
                        width={150}
                        height={150}
                        alt="message"
                    />
                );
                break;
            case TYPE_VIDEO:
                setMessageViewer("");
                break;
            case TYPE_VOICE:
                setMessageViewer(
                    <audio controls>
                        <source src={message.message} type="audio/mp3"></source>
                    </audio>
                );
                break;
            case TYPE_FILE:
                setMessageViewer(
                    <Link href={message.message} className="text-white">
                        <MdCloudDownload /> File
                    </Link>
                );
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (message && message.message_type_id) {
            handleMessageFileViewer(message);
        }
    }, [message]);

    return (
        <div className={"message-bubble " + message.type}>
            <div className="message-content">
                {messageViewer}
                {message.message_text ? <p>{message.message_text}</p> : ""}
                <small>{message.timestamp}</small>
            </div>
        </div>
    );
}
