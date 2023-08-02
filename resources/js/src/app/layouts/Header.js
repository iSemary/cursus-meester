import React from "react";
import Link from "next/link";
import Image from "next/image";

import Logo from "/public/assets/images/logo.svg";
const Header = () => {
    return (
        <header className="">
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
                    <input
                        type="text"
                        className="nav-search"
                        placeholder="Search for courses, insturctors, career, and categories..."
                    />
                </div>
                <div className="col-5">
                    <ul className="nav-links my-0">
                        <li>
                            <Link href="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="categories" className="nav-link">
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="register" className="nav-link">
                                Register
                            </Link>
                        </li>
                        <li>
                            <Link href="login" className="nav-link">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
