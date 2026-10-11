
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import connection


class Command(BaseCommand):
    help = "Create a production admin user using environment variables."

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_ADMIN_USERNAME")
        password = os.environ.get("DJANGO_ADMIN_PASSWORD")
        email = os.environ.get("DJANGO_ADMIN_EMAIL", "")

        if not username or not password:
            raise CommandError(
                "Set DJANGO_ADMIN_USERNAME and DJANGO_ADMIN_PASSWORD first."
            )

        if not os.environ.get("DATABASE_URL"):
            raise CommandError(
                "DATABASE_URL is missing. Refusing to create an admin."
            )

        if connection.vendor != "postgresql":
            raise CommandError(
                "Refusing to create an admin unless the database is PostgreSQL."
            )

        User = get_user_model()

        if User.objects.filter(username=username).exists():
            raise CommandError(
                f"User '{username}' already exists. No changes made."
            )

        User.objects.create_superuser(
            username=username,
            password=password,
            email=email,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Superuser '{username}' created successfully."
            )
        )
