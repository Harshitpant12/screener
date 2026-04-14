import axios from "axios"
import FormData from "form-data"

async function extractTextFromPDF(fileBuffer, fileName) {
    const formData = new FormData()
    formData.append("file", fileBuffer, {
        filename: fileName,
        contentType: "application/pdf"
    })

    const response = await axios.post(
        `${process.env.PYTHON_SERVICE_URL}/extract-text`,
        formData,
        { headers: formData.getHeaders() }
    )

    return response.data.text
}