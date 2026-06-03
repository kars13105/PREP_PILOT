from services.groq_service import client
import json
import re

def resume_agent(skill_level):
    prompt = f"""
You are an expert placement mentor and resume writer.

Skill Level of Candidate: {skill_level}

Please provide 5 high-impact, actionable resume tips customized for a candidate of this skill level.
Your response must be a JSON array of strings:
[
  "Tip 1...",
  "Tip 2...",
  "Tip 3...",
  "Tip 4...",
  "Tip 5..."
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
        # Fallback split logic
        return [tip.strip("- *12345. ") for tip in cleaned.split("\n") if tip.strip()]