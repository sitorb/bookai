from django.conf import settings
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass
