
from pydantic import BaseModel, Field


class Candidate(BaseModel):
    name: str
    match_score: float = Field(ge=0, le=100)
    strengths: list[str]
    missing_skills: list[str]
    overall_assessment: str


candidate = Candidate(
    name="Rahul Sharma",
    match_score=85,
    strengths=["Python", "Django", "SQL"],
    missing_skills=["Docker", "AWS"],
    overall_assessment="Strong match for a junior Python developer role."
)

print(candidate)
print("\nCandidate name:", candidate.name)
print("Match score:", candidate.match_score)
print("Strengths:", candidate.strengths)
print("Missing skills:", candidate.missing_skills)
print("Assessment:", candidate.overall_assessment)



import pymupdf


def extract_resume_text(pdf_path):
    text = ""

    with pymupdf.open(pdf_path) as pdf:
        for page in pdf:
            text += page.get_text()

    return text


resume_text = extract_resume_text("resumes/my_resume.pdf")

print("\n--- RESUME TEXT ---")
print(resume_text)



def extract_skills(resume_text):
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
    ]

    found_skills = []

    for skill in skills:
        if skill.lower() in resume_text.lower():
            found_skills.append(skill)

    return found_skills


skills_found = extract_skills(resume_text)

print("\n--- SKILLS FOUND ---")
print(skills_found)



job_description = """
We are looking for a Python Backend Developer.

Required skills:
Python, Django, Django REST Framework, PostgreSQL,
REST API development, Docker, AWS, Git, and Redis.
"""


def match_skills(candidate_skills, job_description):
    matched_skills = []
    missing_skills = []

    for skill in [
        "Python",
        "Django",
        "Django REST Framework",
        "PostgreSQL",
        "REST API",
        "Docker",
        "AWS",
        "Git",
        "Redis",
    ]:
        if skill.lower() in job_description.lower():
            if skill.lower() in [s.lower() for s in candidate_skills]:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

    return matched_skills, missing_skills


matched, missing = match_skills(skills_found, job_description)

print("\n--- JOB MATCH RESULTS ---")
print("Matched skills:", matched)
print("Missing skills:", missing)



def calculate_match_score(matched_skills, missing_skills):
    total_required = len(matched_skills) + len(missing_skills)

    if total_required == 0:
        return 0.0

    score = (len(matched_skills) / total_required) * 100

    return round(score, 2)


match_score = calculate_match_score(matched, missing)

print("\n--- MATCH SCORE ---")
print(f"Skill coverage: {match_score}%")



candidate_result = Candidate(
    name="Priyanshu Negi",
    match_score=match_score,
    strengths=matched,
    missing_skills=missing,
    overall_assessment=(
        f"Matched {len(matched)} out of "
        f"{len(matched) + len(missing)} required skills."
    )
)

print("\n--- FINAL CANDIDATE RESULT ---")
print(candidate_result.model_dump())



from pathlib import Path

resume_folder = Path("resumes")

for pdf_path in resume_folder.glob("*.pdf"):
    print(f"\nProcessing: {pdf_path.name}")

    text = extract_resume_text(str(pdf_path))
    candidate_skills = extract_skills(text)

    matched_skills, missing_skills = match_skills(
        candidate_skills,
        job_description
    )

    score = calculate_match_score(
        matched_skills,
        missing_skills
    )

    result = Candidate(
        name=pdf_path.stem,
        match_score=score,
        strengths=matched_skills,
        missing_skills=missing_skills,
        overall_assessment=(
            f"Matched {len(matched_skills)} out of "
            f"{len(matched_skills) + len(missing_skills)} "
            "required skills."
        )
    )

    print(result.model_dump())



from pathlib import Path

resume_folder = Path("resumes")

for pdf_path in resume_folder.glob("*.pdf"):
    print(f"\nProcessing: {pdf_path.name}")

    text = extract_resume_text(str(pdf_path))
    candidate_skills = extract_skills(text)

    matched_skills, missing_skills = match_skills(
        candidate_skills,
        job_description
    )

    score = calculate_match_score(
        matched_skills,
        missing_skills
    )

    result = Candidate(
        name=pdf_path.stem,
        match_score=score,
        strengths=matched_skills,
        missing_skills=missing_skills,
        overall_assessment=(
            f"Matched {len(matched_skills)} out of "
            f"{len(matched_skills) + len(missing_skills)} "
            "required skills."
        )
    )

    print(result.model_dump())


import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

print("Groq API connection configured successfully!")

response = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[
        {
            "role": "user",
            "content": f"""
Analyze this resume against the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return the result as valid JSON with these fields:
- name: candidate's name
- match_score: estimated score from 0 to 100
- strengths: list of relevant matching skills
- missing_skills: list of required skills not found in the resume
- overall_assessment: short assessment

Use a match score based on the required skills that are matched.
"""
        }
    ],
    response_format={"type": "json_object"}
)

print("\n--- STRUCTURED AI RESPONSE ---")
print(response.choices[0].message.content)