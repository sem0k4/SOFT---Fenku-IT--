from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_iot import (
    DispositivesIoTViewSet, DonneesCapteursIoTViewSet,
    AlertesIoTViewSet, SessionsWebSocketViewSet
)

# Créer le routeur pour les ViewSets
router = DefaultRouter()
router.register(r'dispositifs', DispositivesIoTViewSet, basename='dispositifs-iot')
router.register(r'donnees', DonneesCapteursIoTViewSet, basename='donnees-capteurs')
router.register(r'alertes', AlertesIoTViewSet, basename='alertes-iot')
router.register(r'sessions', SessionsWebSocketViewSet, basename='sessions-websocket')

urlpatterns = [
    # Routes des ViewSets
    path('api/iot/', include(router.urls)),
    
    # Routes personnalisées pour les dispositifs
    path('api/iot/dispositifs/<int:pk>/status/', 
         DispositivesIoTViewSet.as_view({'post': 'update_status'}), 
         name='dispositif-update-status'),
    
    path('api/iot/dispositifs/<int:pk>/latest-data/', 
         DispositivesIoTViewSet.as_view({'get': 'latest_data'}), 
         name='dispositif-latest-data'),
    
    path('api/iot/dispositifs/<int:pk>/send-command/', 
         DispositivesIoTViewSet.as_view({'post': 'send_command'}), 
         name='dispositif-send-command'),
    
    # Routes personnalisées pour les données
    path('api/iot/donnees/statistics/', 
         DonneesCapteursIoTViewSet.as_view({'get': 'statistics'}), 
         name='donnees-statistics'),
    
    path('api/iot/donnees/real-time/', 
         DonneesCapteursIoTViewSet.as_view({'get': 'real_time_data'}), 
         name='donnees-real-time'),
    
    # Routes personnalisées pour les alertes
    path('api/iot/alertes/<int:pk>/acknowledge/', 
         AlertesIoTViewSet.as_view({'post': 'acknowledge'}), 
         name='alerte-acknowledge'),
    
    path('api/iot/alertes/active/', 
         AlertesIoTViewSet.as_view({'get': 'active_alerts'}), 
         name='alertes-active'),
    
    path('api/iot/alertes/critical/', 
         AlertesIoTViewSet.as_view({'get': 'critical_alerts'}), 
         name='alertes-critical'),
    
    # Routes personnalisées pour les sessions
    path('api/iot/sessions/active/', 
         SessionsWebSocketViewSet.as_view({'get': 'active_sessions'}), 
         name='sessions-active'),
]