from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('', views.Routes),
    path('list-license-plate/', views.ListLisencePlate.as_view()),
    path('token/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.Register),
    path('checkin/', views.CheckIn),
    path('checkout/', views.CheckOut),
    path('delete/<str:pk>/', views.DeleteLicensePlate),
    path('update-checkin/', views.UpdateCheckIn),
    path('update-checkout/', views.UpdateCheckOut),

]
