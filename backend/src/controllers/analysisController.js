import ApiError from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { analyzeResume, extractTextFromPDF } from "../utils/pythonBridge.js"
import getGeminiFeedback from "../utils/geminiFeedback.js"
import Analysis from "../models/Analysis.js"
import ApiResponse from "../utils/apiResponse.js"

const runAnalysis = asyncHandler(async function (req, res) {

    if (!req.file) throw new ApiError(400, "Resume pdf required")

    const pdfBuffer = req.file.buffer
    const fileName = req.file.originalname
    const jdText = req.body.jdText || "" // optional
    const user = req.user

    const resumeText = await extractTextFromPDF(pdfBuffer, fileName)

    const pythonResults = await analyzeResume(resumeText, jdText)

    const feedback = await getGeminiFeedback(resumeText, pythonResults, jdText)

    const result = {
        fileName,
        resumeText,
        jdText,
        pythonResults,
        feedback
    }


    if (user) {
        // your schema expects these specific fields, not a nested object:
        await Analysis.create({
            userId: user._id,
            resumeFileName: fileName,
            resumeText,
            jobDescription: jdText || null,

            // from python
            atsScore: pythonResults.atsScore,
            fitScore: pythonResults.fitScore,
            extractedSkills: pythonResults.extractedSkills,
            matchedSkills: pythonResults.matchedSkills,
            missingSkills: pythonResults.missingSkills,
            atsBreakdown: pythonResults.atsBreakdown,

            // from gemini
            strengths: feedback.strengths,
            weaknesses: feedback.weaknesses,
            suggestions: feedback.suggestions,
            sectionFeedback: feedback.sectionFeedback,
            overallFeedback: feedback.overallFeedback,
        })
    }

    return res.status(200).json(new ApiResponse(200, result, "Analysis completed successfully"))
})

const getMyAnalyses = asyncHandler(async (req, res) => {
    const analyses = await Analysis.find({ userId: req.user._id }).select("-resumeText").sort({ createdAt: -1})
    return res.status(200).json(new ApiResponse(200, analyses, "Analyses fetched successfully"))
})

const getAnalysisById = asyncHandler(async (req, res) => {
    const analysis = await Analysis.findOne({
        _id: req.params.id,
        userId: req.user._id
    })
    if(!analysis) throw new ApiError(404, "Analysis not found")
    return res.status(200).json(new ApiResponse(200, analysis, "Analysis fetched successfully"))
})

export default runAnalysis
export { getMyAnalyses, getAnalysisById }