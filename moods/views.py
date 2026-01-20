from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RecommendView(APIView):
    def post(self, request):
        text = request.data.get("text", "").lower()

        if not text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

        if any(word in text for word in ["груст", "одинок", "печаль", "пусто", "тяжело"]):
            recommendations = [
                {
                    "title": "Маленький принц",
                    "author": "Антуан де Сент-Экзюпери",
                    "reason": "Теплая и философская история, которая помогает почувствовать связь с миром."
                },
                {
                    "title": "Белые ночи",
                    "author": "Фёдор Достоевский",
                    "reason": "История о тонком одиночестве и надежде."
                }
            ]
        elif any(word in text for word in ["мотивац", "рост", "успех", "цель"]):
            recommendations = [
                {
                    "title": "Атомные привычки",
                    "author": "Джеймс Клир",
                    "reason": "Помогает выстроить устойчивые изменения."
                }
            ]
        else:
            recommendations = [
                {
                    "title": "451° по Фаренгейту",
                    "author": "Рэй Брэдбери",
                    "reason": "Когда хочется задуматься о жизни и человеке."
                }
            ]

        return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)
