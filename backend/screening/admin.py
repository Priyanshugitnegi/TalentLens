
from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from .models import ScreeningSession


@admin.register(ScreeningSession)
class ScreeningSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "job_title",
        "total_resumes",
        "successful",
        "failed",
        "created_at",
    )

    search_fields = ("job_title", "job_description")
    list_filter = ("created_at",)
    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
        "formatted_results",
    )

    @admin.display(description="Candidate Results")
    def formatted_results(self, obj):
        if not obj.results:
            return "No results available."

        rows = []

        for result in obj.results:
            filename = result.get("filename", "Unknown file")

            if "error" in result:
                rows.append(
                    format_html(
                        """
                        <div style="padding: 12px; margin-bottom: 12px;
                                    border: 1px solid #dc2626;
                                    border-radius: 8px;">
                            <strong>File:</strong> {}<br>
                            <strong>Error:</strong> {}
                        </div>
                        """,
                        filename,
                        result["error"],
                    )
                )
                continue

            name = result.get("name", "Unknown candidate")
            score = result.get("match_score", 0)
            matched_skills = ", ".join(
                result.get("matched_skills", [])
            )
            missing_skills = ", ".join(
                result.get("missing_skills", [])
            )
            detected_skills = ", ".join(
                result.get("detected_skills", [])
            )
            additional_skills = ", ".join(
                result.get("additional_skills", [])
            )
            strengths = result.get("strengths", [])
            strengths_text = "; ".join(strengths)
            assessment = result.get(
                "overall_assessment",
                "No assessment available.",
            )

            rows.append(
                format_html(
                    """
                    <div style="
                        padding: 16px;
                        margin-bottom: 16px;
                        border: 1px solid #64748b;
                        border-radius: 10px;
                    ">
                        <h3 style="margin-top: 0;">{}</h3>
                        <p><strong>File:</strong> {}</p>
                        <p><strong>Match score:</strong> {}%</p>
                        <p><strong>Matched skills:</strong> {}</p>
                        <p><strong>Missing skills:</strong> {}</p>
                        <p><strong>Detected skills:</strong> {}</p>
                        <p><strong>Additional skills:</strong> {}</p>
                        <p><strong>Strengths:</strong> {}</p>
                        <p><strong>Overall assessment:</strong> {}</p>
                    </div>
                    """,
                    name,
                    filename,
                    score,
                    matched_skills or "None",
                    missing_skills or "None",
                    detected_skills or "None",
                    additional_skills or "None",
                    strengths_text or "None",
                    assessment,
                )
            )

        return mark_safe("".join(str(row) for row in rows))
