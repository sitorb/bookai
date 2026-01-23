from django.http import JsonResponse
from .models import Book
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def book_list(request):
    if request.method == "GET":
        books = Book.objects.all()
        data = [{"id": b.id, "title": b.title, "author": b.author} for b in books]
        return JsonResponse({"books": data})

    if request.method == "POST":
        data = json.loads(request.body)
        book = Book.objects.create(
            title=data["title"],
            author=data["author"],
            description=data.get("description", "")
        )
        return JsonResponse({"id": book.id, "title": book.title, "author": book.author}, status=201)
