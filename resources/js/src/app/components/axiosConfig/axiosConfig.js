import axios from "axios";
import { Token } from "../utilities/Authentication/Token";

const axiosConfig = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Authorization: "Bearer " + Token.get(),
        "Content-Type": "application/json",
    },
});

export default axiosConfig;
