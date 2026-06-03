from services.agents.roadmap_agent import (
    roadmap_agent
)

from services.agents.resume_agent import (
    resume_agent
)

from services.agents.interview_agent import (
    interview_agent
)

from services.memory import user_memory

def supervisor_agent(
    company,
    skill_level,
    goal
):

    user_memory["last_company"] = company

    response = {}

    goal = goal.lower()

    if "roadmap" in goal:

        response["roadmap"] = roadmap_agent(
            company,
            skill_level
        )

    if "resume" in goal:

        response["resume"] = resume_agent(
            skill_level
        )

    if "interview" in goal:

        response["interview"] = interview_agent(
            company
        )

    response["memory"] = user_memory

    return response