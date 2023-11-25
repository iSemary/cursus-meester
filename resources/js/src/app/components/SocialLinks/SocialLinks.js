import React from "react";
import {
    FaFacebook,
    FaGithubAlt,
    FaLinkedinIn,
    FaStackOverflow,
} from "react-icons/fa6";
import { RiGlobalFill, RiTwitterXFill } from "react-icons/ri";

export default function SocialLinks({ links }) {
    const getLinkIcon = (typeId) => {
        switch (typeId) {
            case 1:
                return <FaGithubAlt />;
                break;
            case 2:
                return <FaStackOverflow />;
                break;
            case 3:
                return <FaFacebook />;
                break;
            case 4:
                return <RiTwitterXFill />;
                break;
            case 5:
                return <FaLinkedinIn />;
                break;
            case 6:
                return <RiGlobalFill />;
                break;
            default:
                break;
        }
    };

    return (
        links &&
        links.length > 0 && (
            <ul className="social-links">
                {links.map((link, index) => {
                    return (
                        <li>
                            <a href={link.link_url} target="_blank">
                                {getLinkIcon(link.link_type)} {link.link_title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        )
    );
}
