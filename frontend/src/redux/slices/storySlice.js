import { createSlice } from '@reduxjs/toolkit'

const storySlice = createSlice({
    name: "story",
    initialState: {
        stories: [],
        yourStory: {},
    },
    reducers: {
        setStories: (state, action) => {
            state.stories = action.payload
        },
        setYourStory: (state, action) => {
            state.yourStory = action.payload
        },

    },

});


export const { setStories, setYourStory } = storySlice.actions;
export default storySlice.reducer;