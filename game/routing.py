from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/game/connect/', consumers.GameConsumer.as_asgi()),
]