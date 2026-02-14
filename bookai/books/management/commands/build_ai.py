from django.core.management.base import BaseCommand
from library.recommender import generate_embeddings

class Command(BaseCommand):
    help = 'Turns your library into a vector space using Lite-AI'

    def handle(self, *args, **options):
        # This calls the Lite version we just wrote
        result = generate_embeddings()
        self.stdout.write(self.style.SUCCESS(result))