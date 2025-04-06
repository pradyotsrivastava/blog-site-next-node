import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/auth` }),
  endpoints: (builder) => ({
    // Sign In Endpoint
    signin: builder.mutation({
      query: (credentials) => ({
        url: "/signin",
        method: "POST",
        body: credentials, 
      }),
    }),

    // Sign Up Endpoint
    signup: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData, 
      }),
    }),
  }),
});

export const { useSigninMutation, useSignupMutation } = authApi;

export default authApi;
