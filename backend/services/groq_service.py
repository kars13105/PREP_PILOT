from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
def generate_ai_plan(company, skill_level, goal):

    prompt = f"""
You are an expert placement mentor.

Company: {company}
Skill Level: {skill_level}
Goal: {goal}

Return ONLY valid JSON.

{{
    "roadmap": [
        "step 1",
        "step 2",
        "step 3"
    ],
    "resume_tips": [
        "tip 1",
        "tip 2",
        "tip 3"
    ],
    "interview_questions": [
        "question 1",
        "question 2",
        "question 3"
    ]
}}
"""
    print("\n===== PROMPT =====\n")
    print(prompt)
    print("\n==================\n")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )

    text = response.choices[0].message.content

    print("\n========== RAW RESPONSE ==========\n")
    print(text)
    print("\n==================================\n")

    import json

    cleaned = text.replace("```json", "").replace("```", "").strip()

    return json.loads(cleaned)