from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/iot/(?P<patient_id>\w+)/$', consumers.IoTConsumer.as_asgi()),
    re_path(r'ws/monitoring/(?P<room_name>\w+)/$', consumers.MonitoringConsumer.as_asgi()),
    re_path(r'ws/alerts/$', consumers.AlertConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]