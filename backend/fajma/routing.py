from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Routes pour les consultations
    re_path(r'ws/consultation/(?P<consultation_id>\w+)/$', consumers.ConsultationConsumer.as_asgi()),
    
    # Note: Communication MQTT se fait directement entre ESP32 et Frontend React
    # Le backend Django ne gère que les consultations via WebSocket
    # Architecture IoT: ESP32 → MQTT Broker (EMQX Cloud) → Frontend React (direct)
]