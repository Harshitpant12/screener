import { Router } from "express";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import verifyAdmin from "../middleware/adminMiddleware.js";
import { deleteUser, getAllAnalyses, getAllUsers } from "../controllers/adminController.js";

const router = Router()

router.use(verifyAccessToken, verifyAdmin)

router.route("/users").get(getAllUsers)
router.route("/analyses").get(getAllAnalyses)
router.route("/user/:id").delete(deleteUser)

export default router