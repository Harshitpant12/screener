import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def clean_text_for_matching(text):
    """
    Strips out common JD boilerplate and standardizes punctuation
    so the vectorizer only focuses on actual job content.
    """
    text = text.lower()
    
    boilerplate = [
        'equal opportunity', 'employer', 'dental', 'vision', '401k', 
        'fast paced', 'growing company', 'race', 'gender', 'disability', 
        'veteran', 'benefits', 'salary', 'perks', 'paid time off', 'pto'
    ]
    for b in boilerplate:
        text = text.replace(b, '')
        
    text = re.sub(r'[^a-z0-9\s\+\#\.]', ' ', text)
    return text

def calculate_fit_score(resume_text, jd_text):
    if not jd_text or not jd_text.strip():
        return None
        
    clean_resume = clean_text_for_matching(resume_text)
    clean_jd = clean_text_for_matching(jd_text)

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 3))
    
    try:
        vectors = vectorizer.fit_transform([clean_resume, clean_jd])
        raw_score = cosine_similarity(vectors[0], vectors[1])[0][0]
        
        adjusted_score = min(100.0, raw_score * 2.5 * 100)
        
        return round(adjusted_score, 2)
    except ValueError:
        return 0.0

def extract_skills(text, skills_list):
    text_lower = text.lower()
    found = set()
    
    for skill in skills_list:
        skill_lower = skill.lower()
        escaped_skill = re.escape(skill_lower)
        
        if skill_lower[-1].isalnum():
            pattern = r'(?<!\w)' + escaped_skill + r'(?!\w)'
        else:
            pattern = r'(?<!\w)' + escaped_skill
            
        if re.search(pattern, text_lower):
            found.add(skill_lower)
            
    return list(found)

def get_matched_missing(resume_skills, jd_skills):
    resume_set = set(s.lower() for s in resume_skills)
    jd_set = set(s.lower() for s in jd_skills)
    
    matched = list(resume_set & jd_set)
    missing = list(jd_set - resume_set)
    
    return [m.title() for m in matched], [m.title() for m in missing]
