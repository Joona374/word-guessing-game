from django.db import models

# Create your models here.
class Word(models.Model):
    word = models.CharField(max_length=50, unique=True)  # Store the word (unique to prevent duplicates)
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the word was added

    def __str__(self):
        return self.word