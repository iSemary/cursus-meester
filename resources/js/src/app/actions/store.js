import { configureStore } from "@reduxjs/toolkit";
import getUser from "./userSlice";
import getProfile from "./profileSlice";

export default configureStore({
    reducer: {
        user: getUser,
        profile: getProfile,
    },
});
