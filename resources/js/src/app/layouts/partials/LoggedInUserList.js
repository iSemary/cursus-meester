import Link from "next/link";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiNotification2Line } from "react-icons/ri";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { Token } from "../../components/utilities/Authentication/Token";
import { useRouter } from "next/navigation";

export default function LoggedInUserList({ user }) {
    const router = useRouter();
    const handleLogout = (e) => {
        axiosConfig.post("/auth/logout").then(() => {
            Token.explode();
            router.push("/");
        });
    };

    return (
        <>
            <li>
                <Link href="/notifications" className="nav-link">
                    <IoChatbubblesOutline className="messages-icon" size={23} />
                </Link>
            </li>
            <li className="notifications-icon">
                <Link href="/notifications" className="nav-link">
                    <RiNotification2Line size={23} />
                    {user.data.extra.notifications_count > 0 && (
                        <span className="counter">
                            {user.data.extra.notifications_count}
                        </span>
                    )}
                </Link>
            </li>
            <li>
                <Link href="/my-courses" className="nav-link">
                    My Courses
                </Link>
            </li>
            <li className="d-flex">
                <Dropdown className="split-button">
                    <Link
                        variant="primary"
                        href={`/students/${user.data.user.username}`}
                        className="btn btn-primary split-main-button"
                    >
                        {user.data.user.full_name.split(" ")[0]}
                    </Link>
                    <Dropdown.Toggle split variant="primary" />
                    <Dropdown.Menu className="split-sub-buttons">
                        <Dropdown.Item eventKey="1">
                            <Link className="no-link" href="/settings">
                                Settings
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="2">
                            <Link className="no-link" href="/my-courses">
                                My Courses
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="4" onClick={handleLogout}>
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </li>
        </>
    );
}
