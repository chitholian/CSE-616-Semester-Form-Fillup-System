from django.urls import include, path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from api import views
from .routers import router

urlpatterns = [
    path('approve-forms/', views.ApproveFormsView.as_view()),
    path('input-attendances/', views.InputAttendanceView.as_view()),
    path('auth/obtain-jwt-token/', obtain_jwt_token),
    path('auth/refresh-jwt-token/', refresh_jwt_token),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('', include(router.urls))
]
