"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Logo from "/public/assets/images/logo.svg";
import { useAuth } from "../components/hooks/AuthProvider";
import { FaRegHeart } from "react-icons/fa6";
import LoggedInUserList from "./partials/LoggedInUserList";
import SearchBar from "./partials/SearchBar";
import { ImSpinner10 } from "react-icons/im";
const Header = () => {
    const { user, loading } = useAuth(); // Get auth data

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
                    <SearchBar />
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
                        {loading ? (
                            <>
                                <li>
                                    <ImSpinner10 className="icon-spin-1" />
                                </li>
                            </>
                        ) : user ? (
                            <LoggedInUserList user={user} />
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
