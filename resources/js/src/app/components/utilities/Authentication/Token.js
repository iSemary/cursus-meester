import axios from "axios";
import toastAlert from "../Alert";

export const Token = {
    store(token) {
        // Store token in local storage
        if (token) localStorage.setItem("AUTH_TOKEN", token);
    },
    explode() {
        // Delete token from local storage
        localStorage.removeItem("AUTH_TOKEN");
    },
    get() {
        // Get token from local storage
        return typeof localStorage !== "undefined"
            ? localStorage.getItem("AUTH_TOKEN")
            : null;
    },
    check() {
        // Check storage token is expired or not [Returns True/False]
        return new Promise((resolve, reject) => {
            axios
                .get(process.env.NEXT_PUBLIC_API_URL + "/auth/check", {
                    headers: {
                        Authorization: "Bearer " + this.get(),
                    },
                })
                .then((response) => {
                    resolve(response.data.success);
                })
                .catch(({ response }) => {
                    console.log(response.data.message, "error");
                });
        });
    },
    getUser() {
        return new Promise((resolve, reject) => {
            axios
                .get(process.env.NEXT_PUBLIC_API_URL + "/user/profile", {
                    headers: {
                        Authorization: "Bearer " + this.get(),
                    },
                })
                .then((response) => {
                    resolve(response.data);
                })
                .catch(({ response }) => {
                    console.log(response.data.message, "error");
                });
        });
    },
};
