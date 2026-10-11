
from django.urls import path
from . import views

urlpatterns = [
    path("test/", views.test_api, name="test_api"),
    path("screen/", views.screen_resumes, name="screen_resumes"),
    path("history/", views.screening_history, name="screening_history"),
]
