import mongoose from "mongoose";
import { Project } from "./project.model.js";          
import { User } from "./user.model.js";

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    Ofproject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Project
    },
    AssignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User
    },
    priority:{
        type:String,
        enum:["low", "medium", "high"],
        default: "medium",
    },
    status:{
        type:String,
        enum:["PENDING","IN_PROGRESS","COMPLETED"],
        default: "PENDING"
    }
})

export const Task = mongoose.model("Task", taskSchema)