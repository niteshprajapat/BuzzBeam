import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        token: null,
        suggestedUsers: [],
        followers: [],
        following: [],
        selectedUser: null,
        userProfile: null,
        allUsers: []
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setFollowers: (state, action) => {
            state.followers = action.payload;
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
        },
    },
});


export const { setUser, setToken, setSuggestedUsers, setFollowers, setFollowing, setSelectedUser, setUserProfile, setAllUsers } = userSlice.actions;
export default userSlice.reducer;