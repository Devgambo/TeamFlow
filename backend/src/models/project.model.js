import mongoose from "mongoose";
import { User } from "./user.model.js";

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    // milestones: [{                  //not sure about this one 
    //     title: String, 
    //     deadline: Date, 
    //     completed: { type: Boolean, default: false } 
    //   }],
    status: {
        type: String,
        enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
        default: "PENDING"
    },

}, {timestamps: true})

export const Project = mongoose.model("Project", projectSchema)