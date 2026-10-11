
import os
import json
from pathlib import Path

import pymupdf
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel, Field


# ---------- Configuration ----------

BASE_DIR = Path(__file__).resolve().parent
RESUMES_DIR = BASE_DIR / "resumes"

load_dotenv(BASE_DIR / ".env")

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY is missing from your .env file.")

client = Groq(api_key=api_key)


# ---------- Candidate Data Model ----------

class Candidate(BaseModel):
    name: str
    match_score: float = Field(ge=0, le=100)
    strengths: list[str]
    missing_skills: list[str]
    overall_assessment: str


# ---------- Resume Processing ----------

def extract_resume_text(pdf_path: Path) -> str:
    """Extract text from a PDF resume."""
    with pymupdf.open(pdf_path) as document:
        return "\n".join(page.get_text() for page in document)


def extract_skills(resume_text: str) -> list[str]:
    """Find known skills mentioned in the resume."""
    skills = [
        "Python",
        "Django",
        "Django REST Framework",
        "REST API",
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "React",
        "JavaScript",
        "HTML",
        "CSS",
        "Git",
        "GitHub",
        "Postman",
        "Render",
        "Docker",
        "AWS",
        "Redis",
    ]

    text = resume_text.lower()
    return [skill for skill in skills if skill.lower() in text]


def match_skills(
    candidate_skills: list[str],
    job_description: str,
) -> tuple[list[str], list[str]]:
    """Compare detected skills against required job skills."""
    required_skills = [
        "Python",
        "Django",
        "Django REST Framework",
        "PostgreSQL",
        "REST API",
        "Docker",
        "AWS",
        "Git",
        "Redis",
    ]

    candidate_set = {skill.lower() for skill in candidate_skills}
    job_text = job_description.lower()

    # Only consider skills required by this job description.
    required_skills = [
        skill for skill in required_skills
        if skill.lower() in job_text
    ]

    matched = [
        skill for skill in required_skills
        if skill.lower() in candidate_set
    ]
    missing = [
        skill for skill in required_skills
        if skill.lower() not in candidate_set
    ]

    return matched, missing


def calculate_match_score(
    matched_skills: list[str],
    missing_skills: list[str],
) -> float:
    """Calculate a reproducible score from the required skills."""
    total = len(matched_skills) + len(missing_skills)

    if total == 0:
        return 0.0

    return round(len(matched_skills) / total * 100, 2)


# ---------- AI Assessment ----------

def assess_with_ai(
    resume_text: str,
    job_description: str,
    matched_skills: list[str],
    missing_skills: list[str],
) -> Candidate:
    """Use Groq for qualitative assessment and validate the result."""
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": f"""
Analyze this resume for the supplied job description.

Return valid JSON with exactly these fields:
- name: candidate's name
- strengths: list of relevant skills or experience
- missing_skills: list of required skills not demonstrated
- overall_assessment: a short, evidence-based assessment

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Skills matched by the Python checker:
{json.dumps(matched_skills)}

Skills missing according to the Python checker:
{json.dumps(missing_skills)}

Use the checker's matched and missing skill lists as authoritative.
Do not invent experience or qualifications.
Return JSON only.
""",
            }
        ],
        response_format={"type": "json_object"},
    )

    ai_data = json.loads(response.choices[0].message.content)

    # Python, not the AI, determines the score.
    ai_data["match_score"] = calculate_match_score(
        matched_skills,
        missing_skills,
    )

    # Keep missing skills consistent with the checker.
    ai_data["missing_skills"] = missing_skills

    return Candidate(**ai_data)


# ---------- Main Program ----------

def main() -> None:
    job_description = """
    Python Backend Developer.
    Required skills: Python, Django, Django REST Framework,
    PostgreSQL, REST API development, Docker, AWS, Git, and Redis.
    """

    if not RESUMES_DIR.exists():
        print(f"Resume folder not found: {RESUMES_DIR}")
        return

    resume_files = sorted(RESUMES_DIR.glob("*.pdf"))

    if not resume_files:
        print("No PDF resumes found in the resumes folder.")
        return

    for pdf_path in resume_files:
        print(f"\n{'=' * 50}")
        print(f"Resume: {pdf_path.name}")
        print("=" * 50)

        try:
            resume_text = extract_resume_text(pdf_path)

            if not resume_text.strip():
                print("No text found. This may be a scanned PDF.")
                continue

            skills = extract_skills(resume_text)
            matched, missing = match_skills(skills, job_description)

            print(f"Detected skills: {skills}")
            print(f"Matched skills: {matched}")
            print(f"Missing skills: {missing}")

            candidate = assess_with_ai(
                resume_text,
                job_description,
                matched,
                missing,
            )

            print("\n--- VALIDATED AI RESULT ---")
            print(candidate.model_dump_json(indent=2))

        except Exception as error:
            print(f"Could not process {pdf_path.name}: {error}")


if __name__ == "__main__":
    main()
