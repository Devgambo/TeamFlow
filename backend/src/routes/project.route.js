import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {createProject, getAllProjects, updateProject, deleteProject} from "../controllers/project.controller.js"

const router = Router()

router.route("/").post( verifyJWT , createProject)
router.route("/").get(verifyJWT, getAllProjects)
router.route("/:id").patch(verifyJWT, updateProject)
router.route("/:id").delete(verifyJWT, deleteProject)

//this should redirect it to a different page where it can see al its tasks regarding that project
// router.route("/:id").get(getProjectById)

export default router