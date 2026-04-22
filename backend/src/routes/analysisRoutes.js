import { Router } from "express"

import optionalAuth from "../middleware/optionalAuth.js"
import upload from "../middleware/multer.js"
import runAnalysis, { getMyAnalyses, getAnalysisById } from "../controllers/analysisController.js"
import {verifyAccessToken} from "../middleware/authMiddleware.js"


const router = Router()

router.route('/run').post(optionalAuth, upload.single("resume"), runAnalysis)
router.route('/my').get(verifyAccessToken, getMyAnalyses)
router.route('/:id').get(verifyAccessToken, getAnalysisById)

// this route will be used to wake python as the service will be in render which has cold start
router.route('/wake-python').get(async (req, res) => {
    try {
        await axios.get(`${process.env.PYTHON_SERVICE_URL}/`);
        res.status(200).json({ message: "Python service is awake" });
    } catch (error) {
        res.status(200).json({ message: "Wake up signal sent" });
    }
});

export default router