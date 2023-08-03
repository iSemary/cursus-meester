import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClear, AiOutlineShoppingCart } from "react-icons/ai";
import Logo from "/public/assets/images/logo.svg";

const Header = () => {
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
                            <span className="ms-1">GeestGids</span>
                        </Link>
                    </div>
                </div>
                <div className="col-5">
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
                <div className="col-5">
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
                            <Link href="/login" className="nav-link">
                                Login
                            </Link>
                        </li>
                        <li className="bordered">
                            <Link href="/register" className="nav-link">
                                Create account
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
