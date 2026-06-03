from fastapi import APIRouter
from pydantic import BaseModel

from services.agents.supervisor_agent import (
    supervisor_agent
)

router = APIRouter()

class UserRequest(BaseModel):
    company: str
    skill_level: str
    goal: str

@router.post("/roadmap")
def generate_plan(data: UserRequest):

    result = supervisor_agent(
        data.company,
        data.skill_level,
        data.goal
    )

    return result