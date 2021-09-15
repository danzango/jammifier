from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('scales/<str:root>', views.getMode, name='scales'),
    path('song/<str:track_id>', views.song, name='song'),
    path('suggest/<str:search_string>', views.suggest, name='suggest'),
    path('is_minor/<str:key_sig>', views.is_minor, name='is_minor'),
    path('test', views.test, name='test')
]