import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../components/axiosConfig/axiosConfig";

export const getProfile = createAsyncThunk("profile", async () => {
    const response = await axiosConfig.get("/user/profile");
    return response;
});

export const profileSlice = createSlice({
    name: "profile",
    initialState: {
        data: [],
        success: false,
        status: 402,
    },
    reducers: {},
    extraReducers: {
        [getProfile.fulfilled]: (state, { payload }) => {
            state.data = payload.data.data;
            state.status = payload.data.status;
            state.success = payload.data.success;
        },
        [getProfile.pending]: (state) => {
            state.status = 202;
        },
        [getProfile.rejected]: (state) => {
            state.success = 500;
        },
    },
});

export default profileSlice.reducer;
