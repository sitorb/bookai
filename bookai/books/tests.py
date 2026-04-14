from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

from .models import Book

User = get_user_model()


class RandomBookTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_random_book_returns_200(self):
        """GET /api/books/discovery/random/ returns 200 and includes 'title' when books exist."""
        Book.objects.create(title='Autumn Leaves', author='J. Scribe', summary='A tale of seasons.')
        response = self.client.get('/api/books/discovery/random/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('title', response.json())

    def test_random_book_empty_db(self):
        """GET /api/books/discovery/random/ returns 404 when the book table is empty."""
        response = self.client.get('/api/books/discovery/random/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('message', response.json())


class NooksAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_nooks_requires_auth(self):
        """GET /api/books/nooks/ returns 401 when no token is provided."""
        response = self.client.get('/api/books/nooks/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_nooks_accessible_with_token(self):
        """GET /api/books/nooks/ returns 200 when a valid token is provided."""
        user = User.objects.create_user(username='testreader', password='testpass123')
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        response = self.client.get('/api/books/nooks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
