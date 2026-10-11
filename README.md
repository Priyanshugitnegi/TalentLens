# TalentLens — AI Resume Screening System

TalentLens is an AI-powered resume screening and candidate matching application built with React and Django REST Framework.

## Features

- Upload multiple PDF and DOCX resumes.
- Compare candidates against a job description.
- Extract skills and identify matched and missing skills.
- Generate AI-assisted candidate assessments.
- View candidate match scores, strengths, and additional skills.
- Save screening history.
- Export screening reports as CSV and PDF.
- Compare candidates side by side.

## Tech Stack

**Frontend:** React, Vite, JavaScript, CSS

**Backend:** Python, Django, Django REST Framework

**AI and Processing:** Groq API, Pydantic, PyMuPDF, python-docx

**Database:** SQLite for local development, with PostgreSQL support configured for deployment.

## Local Setup

1. Clone this repository.
2. Create and activate a Python virtual environment.
3. Install Python dependencies using `python -m pip install -r requirements.txt`.
4. Create a `.env` file in the project root and configure your Django secret key, debug setting, and Groq API key.
5. Run database migrations from the `backend` directory using `python manage.py migrate`.
6. Start Django using `python manage.py runserver`.
7. In another terminal, enter the `frontend` directory, install frontend dependencies using `npm install`, and start Vite using `npm run dev`.

Keep API keys and secret keys private. Never commit your `.env` file.