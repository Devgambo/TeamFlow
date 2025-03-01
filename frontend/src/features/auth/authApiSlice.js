import { USERS_URL } from "@/constants";
import { apiSlice } from "@/app/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),

        login: builder.mutation({
            query: (data) => {
                return {
                    url: `${USERS_URL}/login`,
                    method: "POST",
                    body: data,
                };
            },
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
    useLogoutMutation,
    useLoginMutation,
    useSignupMutation,
} = userApiSlice;

