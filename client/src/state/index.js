import { createSlice } from "@reduxjs/toolkit";
//using redux for DARK mode

const initialState = {
  mode: "dark",
  userId: "63701cc1f03239b7f700000e",
};

//function that change the global state / mode - from light to dark
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = globalSlice.actions; //so we'll have access to this funcion

export default globalSlice.reducer;