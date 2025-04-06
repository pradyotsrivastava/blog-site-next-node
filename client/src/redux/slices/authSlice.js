import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  userid: typeof window !== "undefined" ? localStorage.getItem("userid") : null,
  username:
    typeof window !== "undefined" ? localStorage.getItem("username") : null,
  useremail:
    typeof window !== "undefined" ? localStorage.getItem("useremail") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signin: (state, action) => {
      const { token, userid, username, useremail } = action.payload;
      state.token = token;
      state.userid = userid;
      state.username = username;
      state.useremail = useremail;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("userid", userid);
        localStorage.setItem("username", username);
        localStorage.setItem("useremail", useremail);
      }
    },
    signout: (state) => {
      state.token = null;
      state.userid = null;
      state.username = null;
      state.useremail = null;

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        localStorage.removeItem("username");
        localStorage.removeItem("useremail");
      }
    },
  },
});

export const { signin, signout } = authSlice.actions;

export default authSlice.reducer;
