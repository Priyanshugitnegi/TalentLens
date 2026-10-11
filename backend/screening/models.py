
from django.db import models


class ScreeningSession(models.Model):
    job_title = models.CharField(max_length=200, default="Untitled Job")
    job_description = models.TextField()
    total_resumes = models.PositiveIntegerField(default=0)
    successful = models.PositiveIntegerField(default=0)
    failed = models.PositiveIntegerField(default=0)
    results = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.job_title} - {self.created_at:%Y-%m-%d %H:%M}"
