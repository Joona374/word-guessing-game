from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'game'

urlpatterns = [ 
    path("", views.home, name="home"),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='game/login.html'), name='login'), 
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('play', views.play, name='play'), 
]