import Image from "next/image";
import React from "react";

export default function ChatHeader({ userDetails }) {
    return (
        <div className="chat-header">
            <div className="d-flex align-items-center">
                <Image
                    src={userDetails.base_avatar}
                    alt={userDetails.full_name}
                    width="30"
                    height="30"
                    className="rounded-circle"
                />
                <h6 className="font-weight-bold ms-2 my-0">{userDetails.full_name}</h6>
            </div>
        </div>
    );
}
