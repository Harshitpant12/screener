import { Router } from "express"

import optionalAuth from "../middleware/optionalAuth.js"
import upload from "../middleware/multer.js"
import runAnalysis, { getMyAnalyses, getAnalysisById } from "../controllers/analysisController.js"
import {verifyAccessToken} from "../middleware/authMiddleware.js"


const router = Router()

router.route('/run').post(optionalAuth, upload.single("resume"), runAnalysis)
router.route('/my').get(verifyAccessToken, getMyAnalyses)
router.route('/:id').get(verifyAccessToken, getAnalysisById)

export default router