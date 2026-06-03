from services.groq_service import generate_ai_plan

print(
    generate_ai_plan(
        "Google",
        "Beginner",
        "SDE Internship"
    )
)