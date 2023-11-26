import Link from "next/link";
import React from "react";
import { IoTimeOutline } from "react-icons/io5";

export default function NotificationItem({
    to = null,
    subject,
    body,
    seen,
    createdDate,
    createdDateDiff,
}) {
    return (
        <div className={"notification-item " + (seen ? "seen" : "unseen")}>
            <Link href={to ? to : "#"} className="no-link">
                <div className="row">
                    <div className="col-9">
                        <h5 className="font-weight-bold">{subject}</h5>
                        <p className="notification-body">{body}</p>
                    </div>
                    <div className="col-3 text-center">
                        {!seen && (
                            <button className="btn" type="button">
                                Mark as seen
                            </button>
                        )}
                        <div>
                            <small>
                                <IoTimeOutline />{" "}
                                <span title={createdDate}>
                                    {createdDateDiff}
                                </span>
                            </small>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
