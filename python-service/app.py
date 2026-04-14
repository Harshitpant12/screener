from flask import Flask, request, jsonify
from flask_cors import CORS

# from extractor import extract_text_from_pdf # extractor can be used as a backup later but for now we will use pdf-parse in node
from skills_list import SKILLS
from matcher import calculate_fit_score, extract_skills, get_matched_missing
from ats_scorer import calculate_ats_score

app = Flask(__name__)
CORS(app)

# health check route, will be used to wake up Render
@app.route('/health', methods=['GET'])
def health():
    return jsonify({ "status": "ok" })

@app.route('/extract', methods=['POST'])
def extract():
    data = request.get_json() # used to read json body (like req.body)

    resume_text = data.get('resumeText') # .get() returns None if missing
    jd_text = data.get('jdText')         # optional

    if not resume_text:
        return jsonify({ "error": "resumeText is required" }), 400

    ats_score, ats_breakdown = calculate_ats_score(resume_text)
    extracted_skills = extract_skills(resume_text, SKILLS)

    # only run these if jd was provided
    fit_score = None
    matched_skills = []
    missing_skills = []

    if jd_text:
        fit_score = calculate_fit_score(resume_text, jd_text)
        jd_skills = extract_skills(jd_text, SKILLS)
        matched_skills, missing_skills = get_matched_missing(extracted_skills, jd_skills)

    return jsonify({
        "atsScore": ats_score,
        "atsBreakdown": ats_breakdown,
        "extractedSkills": extracted_skills,
        "fitScore": fit_score,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)