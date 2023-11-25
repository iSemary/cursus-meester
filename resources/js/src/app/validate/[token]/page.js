"use client";
import axios from "axios";
import { useEffect } from "react";
import { Token } from "../../components/utilities/Authentication/Token";

export default function validateToken({ params }) {
    // get access token from url
    const accessToken = params.token;
    useEffect(() => {
        if (accessToken) {
            // Check if the access token is valid
            // then store the token to the cookies
            // once the token is saved and the window is close,
            // then the parent window will trigger the token and get the user data
            axios
                .get(process.env.NEXT_PUBLIC_API_URL + "/auth/check", {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                })
                .then((response) => {
                    // save token in cookies
                    Token.store(accessToken);
                    window.close();
                })
                .catch((error) => {
                    window.close();
                });
        }
    }, [accessToken]);
}
