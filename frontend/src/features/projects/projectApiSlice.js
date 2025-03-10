import { apiSlice } from "@/app/apiSlice";
import { PROJECT_URL } from "@/constants";

export const projectApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProjects: builder.query({
            query: () => ({
                url: `${PROJECT_URL}/`,
                method: 'GET',
                credentials: 'include',
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Projects'],
        }),

        createProject: builder.mutation({
            query: (data)=>{
                return{
                    url: `${PROJECT_URL}/`,
                    method: "POST",
                    body: data,
                }
            }
        }),

        
    }),
})

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
} = projectApiSlice;
