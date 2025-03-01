import { USERS_URL } from "@/constants";
import { apiSlice } from "@/app/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        login: builder.mutation({
            query: (userData) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body: userData,
            }),
        }),

        signup: builder.mutation({
            query: (data) => {
                return {
                    url: `${USERS_URL}/signup`,
                    method: "POST",
                    body: data,
                };
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
} = userApiSlice;

