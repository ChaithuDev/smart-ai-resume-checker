import sys
import fitz  # PyMuPDF
import json
import re

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        return text.lower()
    except Exception as e:
        return ""

def load_keywords(job_role):
    job_role = job_role.lower().replace(" ", "").replace("-", "")
    file_path = f"keywords/{job_role}.json"
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except:
        return []

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())

def analyze_resume(resume_path, job_role, company_type):
    resume_text = extract_text_from_pdf(resume_path)
    resume_text = clean_text(resume_text)
    keywords = load_keywords(job_role)

    matched = [kw for kw in keywords if kw.lower() in resume_text]
    missing = [kw for kw in keywords if kw.lower() not in resume_text]

    ats_score = int((len(matched) / len(keywords)) * 100) if keywords else 0

    # ✨ Shortlist Decision
    if ats_score >= 80:
        shortlist_status = "✅ Shortlisted"
    elif ats_score >= 50:
        shortlist_status = "⚠️ Might Be Rejected"
    else:
        shortlist_status = "❌ Rejected"

    # ✨ Suggestions
    suggestions = []
    if ats_score < 70:
        suggestions.append("Include more role-specific keywords from the job description.")
    if "project" not in resume_text:
        suggestions.append("Add a 'Projects' section to showcase your work.")
    if "intern" not in resume_text:
        suggestions.append("Mention any internships or industrial exposure.")
    if "github" not in resume_text:
        suggestions.append("Include your GitHub/portfolio if available.")
    if "certification" not in resume_text and "certificate" not in resume_text:
        suggestions.append("Mention relevant certifications if any.")

    result = {
        "atsScore": ats_score,
        "shortlistStatus": shortlist_status,
        "suggestions": suggestions,
        "missingKeywords": missing
    }

    print(json.dumps(result))

if __name__ == "__main__":
    resume_path = sys.argv[1]
    job_role = sys.argv[2]
    company_type = sys.argv[3]
    analyze_resume(resume_path, job_role, company_type)
