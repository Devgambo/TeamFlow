import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"

import {Project} from "../models/project.model.js"
import {Task} from "../models/task.model.js"

const createProject = asyncHandler(async(req,res)=>{
    const currUser = req.user
    if(currUser.role !== "ADMIN"){
        throw new ApiError(403, "Only Admin can create project")
    }

    const {name, description} = req.body
    if (!name || !description) {
        throw new ApiError(400, "All Feilds are required")
    }

    const project = await Project.create({
        name,
        description,
        createdBy: currUser._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201, project, "New Project Created Successfully"))
})

const getAllProjects = asyncHandler(async(req,res)=>{
    console.log("Getting projects for user:", req.user);
    console.log("User role:", req.user.role);
    console.log("User ID:", req.user._id);
    
    const curruser = req.user;
    let projects;

    try {
        if(curruser.role === "ADMIN"){
            console.log("Fetching projects for ADMIN");
            projects = await Project.find({createdBy: curruser._id});
            console.log("Found projects:", projects);
        }
        if(curruser.role === "MEMBER" ){
            projects = await Task.aggregate([
                {
                    $match: { AssignedTo:curruser._id }
                },
                {
                    $lookup: {
                        from: "projects",
                        localField: "Ofproject",
                        foreignField: "_id",
                        as: "projectDetails",
                    }
                },
                {
                    $unwind: "$projectDetails"
                },
                {
                    $group: {
                        _id: "$projectDetails._id",
                        projectName: { $first: "$projectDetails.name" },
                        description: { $first: "$projectDetails.description" },
                        status: { $first: "$projectDetails.status" },
                        createdBy: { $first: "$projectDetails.createdBy" },
                    }
                }
            ])
        }
        if(!projects || projects.length === 0){
            throw new ApiError(405, "Projects not found")
        }
        return res
        .status(200)
        .json(new ApiResponse(200, projects, "All Projects Fetched Successfully"))
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new ApiError(500, `Error fetching projects: ${error.message}`);
    }
})

const updateProject = asyncHandler(async(req,res)=>{
    const currUser = req.user
    if(currUser.role !== "ADMIN"){
        throw new ApiError(403, "Only Admin can update project")
    }
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid Project ID")
    }
    const project = await Project.findByIdAndUpdate(id, req.body, {new: true})
    if(!project){
        throw new ApiError(404, "Project not found")
    }
    res
    .status(200)
    .json(new ApiResponse(200, project, "Project Updated Successfully"))
})

const deleteProject = asyncHandler(async(req,res)=>{
    const currUser = req.user
    if(currUser.role !== "ADMIN"){
        throw new ApiError(403, "Only Admin can delete project")
    }
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid Project ID")
    }
    const project = await Project.findByIdAndDelete(id)
    if(!project){
        throw new ApiError(404, "Project not found")
    }
    res
    .status(200)
    .json(new ApiResponse(200, project, "Project Deleted Successfully"))

})



const getProjectById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid Project ID")
    }
    // const project = await Project.findById(id).populate("createdBy", "username email")
    // if(!project){
    //     throw new ApiError(404, "Project not found")
    // }

    // const members = await User.find({role: "MEMBER"})
    // if(!members){
    //     throw new ApiError(404, "Members not found")
    // }

    res
    .status(200)
    // .json(new ApiResponse(201, members, "All Members Fetched Successfully"))
    // .json(new ApiResponse(201, project, "Project Fetched Successfully"))
})




export {createProject, getAllProjects, updateProject, deleteProject}



