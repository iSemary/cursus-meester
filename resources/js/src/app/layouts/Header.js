"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClear, AiOutlineShoppingCart } from "react-icons/ai";
import Logo from "/public/assets/images/logo.svg";
import { useAuth } from "../components/hooks/AuthProvider";
import { Button, Dropdown } from "react-bootstrap";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import { Token } from "../components/utilities/Authentication/Token";
import { useRouter } from "next/navigation";
import { FaRegHeart } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiNotification2Line } from "react-icons/ri";
const Header = () => {
    const router = useRouter();
    const { user } = useAuth(); // Get auth data

    const handleLogout = (e) => {
        axiosConfig.post("/auth/logout").then(() => {
            Token.explode();
            router.push("/");
        });
    };

    return (
        <header className="main-header">
            <nav className="row align-items-center">
                <div className="col-2">
                    <div className="logo flex-center">
                        <Link href="/" className="logo-title flex-center">
                            <Image
                                src={Logo}
                                width={35}
                                height={35}
                                alt="logo"
                            />
                            <span className="ms-1">
                                {process.env.NEXT_PUBLIC_APP_NAME}
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="col-4">
                    <div className="search-container">
                        <input
                            type="text"
                            className="nav-search"
                            placeholder="Search for courses, instructors, career, and categories..."
                        />
                        <div className="search-results">
                            <ul>
                                <li>
                                    <div>PHP course</div>
                                    <div>
                                        <AiOutlineClear />
                                    </div>
                                </li>
                                <li>
                                    <div>PHP course</div>
                                    <div>
                                        <AiOutlineClear />
                                    </div>
                                </li>
                                <li>
                                    <div>PHP course</div>
                                    <div>
                                        <AiOutlineClear />
                                    </div>
                                </li>
                                <li>
                                    <div>PHP course</div>
                                    <div>
                                        <AiOutlineClear />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <ul className="nav-links my-0">
                        <li>
                            <Link href="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" className="nav-link">
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/cart" className="nav-link cart-link">
                                <AiOutlineShoppingCart size={25} />
                            </Link>
                        </li>
                        <li>
                            <Link href="/wishlist" className="nav-link">
                                <FaRegHeart size={23} />
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li>
                                    <Link
                                        href="/notifications"
                                        className="nav-link"
                                    >
                                        <IoChatbubblesOutline
                                            className="messages-icon"
                                            size={23}
                                        />
                                    </Link>
                                </li>
                                <li className="notifications-icon">
                                    <Link
                                        href="/notifications"
                                        className="nav-link"
                                    >
                                        <RiNotification2Line size={23} />
                                        {user.data.extra.notifications_count >
                                            0 && (
                                            <span className="counter">
                                                {
                                                    user.data.extra
                                                        .notifications_count
                                                }
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/my-courses"
                                        className="nav-link"
                                    >
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
                                            {
                                                user.data.user.full_name.split(
                                                    " "
                                                )[0]
                                            }
                                        </Link>
                                        <Dropdown.Toggle
                                            split
                                            variant="primary"
                                        />
                                        <Dropdown.Menu className="split-sub-buttons">
                                            <Dropdown.Item eventKey="1">
                                                <Link
                                                    className="no-link"
                                                    href="/settings"
                                                >
                                                    Settings
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="2">
                                                <Link
                                                    className="no-link"
                                                    href="/my-courses"
                                                >
                                                    My Courses
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                                eventKey="4"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login" className="nav-link">
                                        Login
                                    </Link>
                                </li>
                                <li className="bordered">
                                    <Link href="/register" className="nav-link">
                                        Create account
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
