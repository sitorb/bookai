from django.contrib import admin
from .models import RecommendationHistory, RecommendedBook

admin.site.register(RecommendationHistory)
admin.site.register(RecommendedBook)
