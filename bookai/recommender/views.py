# recommender/views.py
from django.shortcuts import render
# ... other imports ...
from .models import Recommendation  # Change 'RecommendationHistory' to 'Recommendation'

# Note: You will also need to find where 'RecommendationHistory' is used 
# inside your functions and rename it to 'Recommendation' there too.