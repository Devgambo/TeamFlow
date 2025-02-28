import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import {Task}  from "../models/task.model.js"
import {User} from "../models/user.model.js"

const getAllTask = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const tasks = await Task.find({Ofproject: id})
    const members = await User.find({role: "MEMBER"})
    if(!members){
        ApiError(404, "Members not found")
    }

    if(!tasks){
        res
        .status(200)
        .json(new ApiResponse(200, members, "Members Fetched Successfully"))
    }

    res
    .status(200)
    .json(new ApiResponse(200, {members, tasks}, "Members and Tasks Fetched Successfully"))
})

const createTask = asyncHandler(async(req,res)=>{
    const {id} = req.params     //project id
    const currUser = req.user
    if(currUser.role!=="ADMIN"){
        ApiError(403,"Only Admins can create Projects")
    }
    const {title, desc, priority, username} = req.body
    if(!title || !desc){
        ApiError(400,"title and desc are required")
    }

    const assigned = User.findone({username: username})

    const task = await Task.create({
        title,
        desc,
        Ofproject: id,
        AssignedTo: assigned._id,
        priority,
    })

    res
    .status(201)
    .redirect(`/api/colpro/projects/${id}/tasks`)
})

const getTaskById = asyncHandler(async(req,res)=>{
    const {taskId} = req.params
    const task = await Task.findOne({_id:taskId})
    if(!task){
        throw new ApiError(404,"task not found!")
    }

    res
    .status(200)
    .json(new ApiResponse(200,task,"Task fetched"))
})

const updateTask = asyncHandler(async(req,res)=>{
    const currUser = req.user
    if(!currUser.role=="ADMIN"){
        throw ApiError(400,"Only Admins can update a task")
    }
    const {id} = req.params
    const {taskId} = req.params
    const {title, desc, priority, status} = req.body
    const task = await Task.findOneAndUpdate({_id:taskId}, {title, desc, priority, status})
    if(!task){
        throw new ApiError(404,"task not found!")
    }
    res
    .status(200)
    .redirect(`/api/colpro/projects/${id}/tasks`)
})

const deleteTask = asyncHandler(async(req,res)=>{
    const currUser = req.user
    if(!currUser.role=="ADMIN"){
        throw ApiError(400,"Only Admins can delete a task")
    }
    const {id} = req.params
    const {taskId} = req.params
    const task = await Task.findOneAndDelete({_id:taskId})
    if(!task){
        throw new ApiError(404,"task not found!")
    }
    res
    .status(200)
    .redirect(`/api/colpro/projects/${id}/tasks`)
})

export {createTask, getAllTask, updateTask, deleteTask, getTaskById}