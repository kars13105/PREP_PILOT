from services.groq_service import client
import json
import re

def roadmap_agent(company, skill_level):
    prompt = f"""
You are an expert career and placement mentor.

Company: {company}
Skill Level: {skill_level}

Generate a step-by-step preparation roadmap to clear interviews at {company} starting from a {skill_level} level.
Provide 5-7 clear, actionable phases/steps.
Your response must be a JSON array of strings:
[
  "Step 1:...",
  "Step 2:..."
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
        return [step.strip("- *12345. ") for step in cleaned.split("\n") if step.strip()]