import re

def calculate_ats_score(text):
    score = 0
    breakdown = {}
    text_lower = text.lower()
    words = text.split()
    word_count = len(words)

    # Contact & Identity (Max 15 points)
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+', text))
    has_phone = bool(re.search(r'\b(?:\+\d{1,2}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', text))
    has_linkedin = "linkedin.com" in text_lower
    has_portfolio = "github.com" in text_lower or "portfolio" in text_lower

    contact_score = (has_email * 5) + (has_phone * 5) + (has_linkedin * 3) + (has_portfolio * 2)
    score += contact_score
    breakdown["ContactInfo"] = {
        "score": contact_score, 
        "max": 15,
        "details": {"email": has_email, "phone": has_phone, "linkedin": has_linkedin}
    }

    # Structural Sections (Max 20 points)
    sections = {
        "Summary": len(re.findall(r'\b(summary|objective|profile)\b', text_lower)) > 0,
        "Experience": len(re.findall(r'\b(experience|employment|work history)\b', text_lower)) > 0,
        "Education": len(re.findall(r'\b(education|academic|degree)\b', text_lower)) > 0,
        "Skills": len(re.findall(r'\b(skills|technologies|core competencies)\b', text_lower)) > 0,
    }
    
    section_score = sum(sections.values()) * 5
    score += section_score
    breakdown["Sections"] = {
        "score": section_score, 
        "max": 20, 
        "missing": [k for k, v in sections.items() if not v]
    }

    # Impact & Quantifiability (Max 35 points)
    numbers_found = len(re.findall(r'\b\d+\b', text)) + len(re.findall(r'%|\$|percent', text_lower))
    
    action_verbs = ['led', 'developed', 'managed', 'created', 'optimized', 'increased', 'decreased',
                    'designed', 'implemented', 'achieved', 'spearheaded', 'resolved', 'improved']
    verbs_found = sum(1 for verb in action_verbs if verb in text_lower)

    impact_score = min(20, numbers_found * 2) + min(15, verbs_found * 2)
    score += impact_score
    breakdown["ImpactMetrics"] = {
        "score": impact_score,
        "max": 35,
        "quantifiableDataPoints": numbers_found,
        "actionVerbs": verbs_found
    }

    # Word Count & Length (Max 15 points)
    length_score = 0
    if 300 <= word_count <= 850:
        length_score = 15  # The Goldilocks zone
    elif 200 <= word_count < 300 or 850 < word_count <= 1100:
        length_score = 10
    elif 100 <= word_count < 200:
        length_score = 5
    else:
        length_score = 0 # Too short, or massive keyword stuffing

    score += length_score
    breakdown["WordCount"] = {"score": length_score, "max": 15, "count": word_count}

    # 5. Formatting & Readability (Max 15 points)
    bullet_points = len(re.findall(r'(?:^|\n)\s*(?:[-•*]|\d+\.)', text))
    bullet_score = min(15, int(bullet_points * 1.5))
    score += bullet_score
    breakdown["Readability"] = {"score": bullet_score, "max": 15, "bulletsDetected": bullet_points}

    # Final Calculation
    final_score = int(min(100, max(0, score)))

    if not sections["Experience"] and final_score > 70:
        final_score -= 15

    formatted_breakdown = {
        "contactInfo": breakdown["ContactInfo"]["score"] / 15 * 100,
        "sectionCompleteness": breakdown["Sections"]["score"] / 20 * 100,
        "impactAndMetrics": breakdown["ImpactMetrics"]["score"] / 35 * 100,
        "lengthOptimization": breakdown["WordCount"]["score"] / 15 * 100,
        "readability": breakdown["Readability"]["score"] / 15 * 100
    }

    return final_score, formatted_breakdown