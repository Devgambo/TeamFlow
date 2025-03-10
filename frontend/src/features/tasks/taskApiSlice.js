import { apiSlice } from "@/app/apiSlice";
import { PROJECT_URL } from "@/constants";

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllTasks: builder.query({
            query: (projectId) => ({
                url: `${PROJECT_URL}/${projectId}/tasks`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, projectId) => [
                { type: "Tasks", id: projectId },
            ],
        }),

        createTask: builder.mutation({
            query: ({ projectId, taskData }) => ({
                url: `${PROJECT_URL}/${projectId}/tasks`,
                method: "POST",
                body: taskData,
                credentials: "include",
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Tasks", id: projectId },
            ],
        }),

        
    }),
})

export const {
    useCreateTaskMutation,
    useGetAllTasksQuery,
    
} = taskApiSlice;