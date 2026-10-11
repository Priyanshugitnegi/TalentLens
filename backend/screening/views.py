
import sys
import tempfile
from pathlib import Path

from django.db import transaction
from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

# Add the project root to Python's import path.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(PROJECT_ROOT))

from screening_service import screen_resume
from .models import ScreeningSession


def home(request):
    """Render the TalentLens landing page."""
    return render(request, "screening/home.html")


@api_view(["GET"])
def test_api(request):
    return Response({
        "message": "AI Resume Screening API is working!",
        "status": "success",
    })


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def screen_resumes(request):
    job_description = request.data.get("job_description", "").strip()
    job_title = request.data.get("job_title", "").strip() or "Untitled Job"
    uploaded_files = request.FILES.getlist("resumes")

    if not job_description:
        return Response(
            {"error": "Please provide a job description."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not uploaded_files:
        return Response(
            {"error": "Please upload at least one PDF or DOCX resume."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    results = []

    for uploaded_file in uploaded_files:
        if not uploaded_file.name.lower().endswith((".pdf", ".docx")):
            results.append({
                "filename": uploaded_file.name,
                "error": "Only PDF and DOCX files are supported.",
            })
            continue

        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                file_path = Path(temp_dir) / Path(uploaded_file.name).name

                with open(file_path, "wb") as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)

                candidate = screen_resume(file_path, job_description)

                results.append({
                    "filename": uploaded_file.name,
                    **candidate.model_dump(),
                })

        except Exception as error:
            print(
                f"Error processing {uploaded_file.name}: "
                f"{type(error).__name__}: {error}"
            )

            results.append({
                "filename": uploaded_file.name,
                "error": (
                    "We couldn't analyze this resume. "
                    "Please check that the file is readable and try again. "
                    "If the problem persists, contact the administrator."
                ),
            })

    successful_results = [
        result for result in results if "match_score" in result
    ]

    successful_results.sort(
        key=lambda result: result["match_score"],
        reverse=True,
    )

    failed_results = [
        result for result in results if "error" in result
    ]

    # Save the completed screening session.
    with transaction.atomic():
        session = ScreeningSession.objects.create(
            job_title=job_title,
            job_description=job_description,
            total_resumes=len(uploaded_files),
            successful=len(successful_results),
            failed=len(failed_results),
            results=successful_results + failed_results,
        )

    return Response({
        "session_id": session.id,
        "job_title": session.job_title,
        "created_at": session.created_at,
        "total_resumes": len(uploaded_files),
        "successful": len(successful_results),
        "results": successful_results,
        "failed": failed_results,
    })


@api_view(["GET"])
def screening_history(request):
    """Return saved screening sessions, newest first."""
    sessions = ScreeningSession.objects.all()

    history = [
        {
            "id": session.id,
            "job_title": session.job_title,
            "job_description": session.job_description,
            "total_resumes": session.total_resumes,
            "successful": session.successful,
            "failed": session.failed,
            "results": session.results,
            "created_at": session.created_at,
        }
        for session in sessions
    ]

    return Response({"history": history})
