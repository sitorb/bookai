from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import json

User = get_user_model()

@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not email or not password or not username:
        return JsonResponse({"error": "email, username and password are required"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "User with this email already exists"}, status=400)

    user = User.objects.create_user(
        email=email,
        username=username,
        password=password
    )

    return JsonResponse({"message": "User registered successfully"})
