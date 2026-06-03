from services.groq_service import client
import json
import re

def interview_agent(company):
    prompt = f"""
You are an expert technical interviewer at top tech companies.

Target Company: {company}

Please generate 5 representative interview questions frequently asked at {company}.
Ensure a mix of coding/technical questions and behavioral/values questions matching the company culture.
Your response must be a JSON array of strings:
[
  "Question 1...",
  "Question 2..."
]
Return ONLY valid JSON. Do not include markdown code block formatting or explanations.
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
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        cleaned = match.group(0)
    else:
        cleaned = text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(cleaned)
    except Exception:
        return [q.strip("- *12345. ") for q in cleaned.split("\n") if q.strip()]