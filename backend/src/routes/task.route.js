import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {createTask, getAllTask, updateTask, deleteTask, getTaskById} from "../controllers/task.controller.js"
const router = Router()

router.route("/").get(verifyJWT,getAllTask)
router.route("/").post(verifyJWT,createTask)
router.route("/:id").patch(verifyJWT,updateTask)
router.route("/:id").delete(verifyJWT,deleteTask)
router.route("/:id").get(verifyJWT,getTaskById)

export default router