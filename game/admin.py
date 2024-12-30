from django.contrib import admin
from .models import Word
# Register your models here.

@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = ('word', 'created_at')  # Display these fields in the admin list view
    search_fields = ('word',)             # Enable search by word
    ordering = ('-created_at',)           # Order by newest first