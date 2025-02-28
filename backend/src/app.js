import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import userRouter from "./routes/user.route.js"
import projectRouter from "./routes/project.route.js"
import taskRouter from "./routes/task.route.js"

//routes declaration
app.use("/api/colpro", userRouter)
app.use("/api/colpro/projects", projectRouter)
app.use("/api/colpro/projects/:id/tasks", taskRouter)


export { app }