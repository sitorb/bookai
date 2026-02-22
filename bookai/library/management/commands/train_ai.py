from django.core.management.base import BaseCommand
from library.recommender import generate_embeddings

class Command(BaseCommand):
    help = 'Пересобирает векторный индекс для поиска книг'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Начинаю процесс... Это может занять минуту.'))
        result = generate_embeddings()
        self.stdout.write(self.style.SUCCESS(result))