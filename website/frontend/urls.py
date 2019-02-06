from django.contrib.staticfiles.views import serve
from django.urls import re_path

urlpatterns = [
    re_path('^.*', serve, {'path': 'frontend/index.html'})
]
