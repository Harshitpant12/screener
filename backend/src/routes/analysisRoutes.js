import { Router } from "express"

import optionalAuth from "../middleware/optionalAuth.js"
import upload from "../middleware/multer.js"
import runAnalysis, { getMyAnalyses, getAnalysisById } from "../controllers/analysisController.js"
import {verifyAccessToken} from "../middleware/authMiddleware.js"
import axios from "axios"


const router = Router()

router.route('/run').post(optionalAuth, upload.single("resume"), runAnalysis)
router.route('/my').get(verifyAccessToken, getMyAnalyses)
router.route('/:id').get(verifyAccessToken, getAnalysisById)

// this route will be used to wake python as the service will be in render which has cold start
router.get('/wake-python', async (req, res) => {
    try {
        await axios.get(`${process.env.PYTHON_SERVICE_URL}/wake`);
        
        return res.status(200).json({ 
            success: true, 
            message: "Python engine is awake." 
        });
    } catch (error) {
        return res.status(200).json({ 
            success: true, 
            message: "Python engine is spinning up." 
        });
    }
});

export default router