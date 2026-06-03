from fastapi import APIRouter, UploadFile, File, Form


from services.resume_parser import extract_text
from services.resume_agent import analyze_resume_job
from services.job_scraper import scrape_job

router = APIRouter()


@router.post("/resume-match")
async def resume_match(
    resume: UploadFile = File(...),
    job_link: str = Form(...)
):

    resume_text = extract_text(resume)

    job_description = scrape_job(job_link)
    print("RESUME TEXT:")
    print(resume_text[:500])

    print("JOB DESCRIPTION:")
    print(job_description[:500])
    result = analyze_resume_job(
        resume_text,
        job_description
    )

    return result