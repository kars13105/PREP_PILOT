from services.groq_service import client
import json
import re

def analyze_resume_job(resume_text, job_description):
    if not job_description or not job_description.strip():
        job_context = "No specific job description was provided. Please perform a general career and resume audit for modern tech roles based on the resume contents."
    else:
        job_context = f"Job Description:\n{job_description}"

    prompt = f"""
You are an expert ATS (Applicant Tracking System) recruiter and career mentor.

Resume:
{resume_text}

{job_context}

Carefully compare the resume against the target Job Description (or do a general tech resume audit if no Job Description is provided).
Provide a realistic comparison and suggest personalized, non-generic steps.

Identify:
1. match_score: A realistic ATS match score between 0 and 100 based on keyword overlap, experience alignment, and skills.
2. missing_skills: Specific technical skills, frameworks, databases, tools, or methodologies that are required/preferred in the job description but missing or weak in the resume.
3. resume_improvements: Explicitly actionable tips to improve the resume (e.g. 'Add a section for metrics on Project X', 'Use action verbs like Developed instead of Worked').
4. roadmap: A structured 3-5 step preparation roadmap based on their missing skills.
5. interview_questions: 5 targeted technical or behavioral interview questions relevant to this job description and the candidate's background.

Return ONLY valid JSON in this exact structure:
{{
    "match_score": 75,
    "missing_skills": ["Skill A", "Skill B"],
    "resume_improvements": ["Suggestion 1", "Suggestion 2"],
    "roadmap": ["Step 1", "Step 2"],
    "interview_questions": ["Question 1", "Question 2"]
}}

Do NOT include any introduction, conversational text, or markdown code blocks. Return only raw, valid JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    text = response.choices[0].message.content

    # Robustly extract JSON block using regex in case model wraps with text or markdown
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        cleaned_text = match.group(0)
    else:
        cleaned_text = text.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(cleaned_text)
        
        # Ensure fallback list fields are present
        for key in ["missing_skills", "resume_improvements", "roadmap", "interview_questions"]:
            if key not in data or not isinstance(data[key], list):
                data[key] = []
        if "match_score" not in data:
            data["match_score"] = 0
            
        # Backwards compatibility in case any system relies on resume_suggestions
        data["resume_suggestions"] = data["resume_improvements"]
        return data
    except Exception as e:
        print(f"Error parsing LLM response as JSON: {e}")
        # Graceful fallback response
        return {
            "match_score": 50,
            "missing_skills": ["Please double check your resume and job URL format"],
            "resume_improvements": ["Could not parse LLM suggestions. Please try again."],
            "resume_suggestions": ["Could not parse LLM suggestions. Please try again."],
            "roadmap": ["Refresh or re-submit to regenerate roadmap."],
            "interview_questions": ["What is your experience with modern software engineering practices?"]
        }