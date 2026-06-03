import os
import sys


sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.agents.supervisor_agent import supervisor_agent
from services.resume_agent import analyze_resume_job
from services.job_scraper import scrape_job

def test_company_prep():
    print("\n[TEST] Starting Company Prep Assistant (Feature 1)...")
    try:
        result = supervisor_agent(
            company="Google",
            skill_level="Intermediate",
            goal="roadmap, resume, interview for SDE role"
        )
        
        assert "roadmap" in result, "Roadmap missing in response"
        assert "resume" in result, "Resume missing in response"
        assert "interview" in result, "Interview missing in response"
        assert "memory" in result, "Memory missing in response"
        
        print("Roadmap Steps generated successfully:")
        for step in result["roadmap"][:2]:
            print(f"  - {step}")
            
        print("Resume Tips generated successfully:")
        for tip in result["resume"][:2]:
            print(f"  - {tip}")
            
        print("Interview Questions generated successfully:")
        for q in result["interview"][:2]:
            print(f"  - {q}")
            
        print("✓ Feature 1 Test Passed!")
    except Exception as e:
        print(f"✗ Feature 1 Test Failed: {e}")
        raise e

def test_resume_matching():
    print("\n[TEST] Starting Resume & Job Match Analyzer (Feature 2)...")
    try:
        mock_resume = """
        John Doe
        john.doe@example.com
        Skills: Python, Javascript, React, SQL, Git
        Experience:
        Software Engineering Intern at Tech Corp (6 months)
        - Developed web applications using React and Python
        - Wrote SQL queries and designed databases
        """
        
        mock_job = """
        Software Development Engineer (SDE)
        Requirements:
        - 1+ years of experience with React, TypeScript, Node.js, and Python
        - Experience with relational databases like SQL
        - Understanding of cloud platforms (AWS or GCP) and Docker
        """
        
        result = analyze_resume_job(mock_resume, mock_job)
        
        assert "match_score" in result, "match_score missing in response"
        assert "missing_skills" in result, "missing_skills missing in response"
        assert "resume_improvements" in result, "resume_improvements missing in response"
        assert "roadmap" in result, "roadmap missing in response"
        assert "interview_questions" in result, "interview_questions missing in response"
        
        print(f"Match Score: {result['match_score']}%")
        print("Missing Skills detected:")
        for skill in result['missing_skills']:
            print(f"  - {skill}")
        print("Resume Improvements Suggested:")
        for tip in result['resume_improvements'][:2]:
            print(f"  - {tip}")
        print("✓ Feature 2 Test Passed!")
    except Exception as e:
        print(f"✗ Feature 2 Test Failed: {e}")
        raise e

if __name__ == "__main__":
    print("==================================================")
    print("         PREP_PILOT End-to-End Pipeline Validator ")
    print("==================================================")
    
   
    try:
        test_company_prep()
        test_resume_matching()
        print("\n==================================================")
        print("         ALL TESTS COMPLETED SUCCESSFULLY! ")
        print("==================================================")
    except Exception:
        sys.exit(1)
