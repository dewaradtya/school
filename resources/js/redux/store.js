import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice"

const store = configureStore({
    reducer: {
        user: userReducer
    }
})
console.log('store initial: ', store.getState())

store.subscribe(() => {
    console.log('store change: ', store.getState())
})

export default store