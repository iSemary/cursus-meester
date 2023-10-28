import axios from "axios";

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
        return localStorage.getItem("AUTH_TOKEN");
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
                    reject(error);
                });
        });
    },
};
