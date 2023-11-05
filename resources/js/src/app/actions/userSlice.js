import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../components/axiosConfig/axiosConfig";

export const getUser = createAsyncThunk("user", async () => {
    const response = await axiosConfig.get("/auth/user");
    return response;
});

export const userSlice = createSlice({
    name: "user",
    initialState: {
        data: [],
        success: false,
        status: 402,
    },
    reducers: {},
    extraReducers: {
        [getUser.fulfilled]: (state, { payload }) => {
            state.data = payload.data.data;
            state.status = payload.data.status;
            state.success = payload.data.success;
        },
        [getUser.pending]: (state) => {
            state.status = 202;
        },
        [getUser.rejected]: (state) => {
            state.success = 500;
        },
    },
});

export default userSlice.reducer;
