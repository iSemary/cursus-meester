import axios from "axios";
import Cookies from "js-cookie";

export const Token = {
    store(token) {
        // Store token in local storage
        if (token) {
            Cookies.set("AUTH_TOKEN", token, { expires: 365 * 100 });
        }
    },
    explode() {
        // Delete token from local storage
        Cookies.set("AUTH_TOKEN", "");
        localStorage.removeItem("AUTH_TOKEN");
    },
    get() {
        // Get token from local storage
        return Cookies.get("AUTH_TOKEN");
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
                .catch((error) => {
                    console.log("Error in Token.check:", error);
                    reject(false);
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
                .catch((error) => {
                    console.log("Error in Token.getUser:");
                    reject(false);
                });
        });
    },
};
