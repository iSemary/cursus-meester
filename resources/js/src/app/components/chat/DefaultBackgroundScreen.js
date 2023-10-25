import Image from "next/image";
import React from "react";
import DefaultBackgroundImage from "/public/assets/images/backgrounds/chat-bg.png";

export default function DefaultBackgroundScreen() {
    return (
        <div>
            <div className="default-background-screen">
                <Image
                    src={DefaultBackgroundImage}
                    width={"100%"}
                    height={"100%"}
                    alt="default-chat-image"
                />
                <div className="details">
                    <h5>Start new conversation</h5>
                    <p>
                        Start a conversation and let's explore the world of
                        courses and technology together.
                    </p>
                    <small>
                        <i className="pi pi-lock"></i> Your messages are end to
                        end encrypted
                    </small>
                </div>
            </div>
        </div>
    );
}
