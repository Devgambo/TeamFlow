import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import { useGetAllTasksQuery, useCreateTaskMutation } from '@/features/tasks/taskApiSlice' 

function TaskPageAdmin() {
    const {projectId} = useParams();
    
    return (
        <div>
            {/* TASK CREATION */}
        </div>
    )
}

export default TaskPageAdmin
