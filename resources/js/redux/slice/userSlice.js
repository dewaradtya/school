import { createSlice } from "@reduxjs/toolkit";

const useSlice = createSlice({
    name: "user",
    initialState: {
        data: null
    },
    reducers: {
        setUser: (state, action) => {
            state.data.push(action.payload)
        }
    }
})

export const { setUser } = useSlice.actions
export default useSlice.reducer