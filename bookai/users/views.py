from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Profile, SearchHistory

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Fields required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username taken'}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_search_history(request):
    history = SearchHistory.objects.filter(user=request.user).order_by('-timestamp')[:10]
    data = [{
        'query': h.query_text, 
        'mood': h.detected_mood, 
        'date': h.timestamp.strftime("%b %d")
    } for h in history]
    return Response(data)

# users/views.py
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_search_history(request):
    """
    Deletes all search history records associated with the logged-in user.
    """
    SearchHistory.objects.filter(user=request.user).delete()
    return Response({'message': 'History cleared successfully'}, status=status.HTTP_204_NO_CONTENT)