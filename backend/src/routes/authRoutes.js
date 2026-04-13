import { Router } from "express";

import validate from "../middleware/validate.js"
import { loginSchema, registerSchema } from "../validators/authValidator.js"
import { getMe, login, logout, refresh, register } from "../controllers/authController.js";
import { verifyAccessToken, verifyRefreshToken } from "../middleware/authMiddleware.js";

const router = Router()

router.route('/register').post(validate(registerSchema), register)
router.route('/login').post(validate(loginSchema), login)
router.route('/logout').post(verifyAccessToken, logout)
router.route('/me').get(verifyAccessToken, getMe)
router.route('/refresh').post(verifyRefreshToken, refresh)

export default router;