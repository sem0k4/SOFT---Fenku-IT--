import json
import uuid
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import (
    DispositivesIoT, DonneesCapteursIoT, AlertesIoT, 
    SessionsWebSocket, Patient
)
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class IoTConsumer(AsyncWebsocketConsumer):
    """Consumer pour recevoir les données des dispositifs IoT (ESP32)"""
    
    async def connect(self):
        self.patient_id = self.scope['url_route']['kwargs']['patient_id']
        self.room_group_name = f'iot_patient_{self.patient_id}'
        
        # Rejoindre le groupe de la chambre
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Enregistrer la session WebSocket
        if self.scope["user"].is_authenticated:
            await self.save_websocket_session()
        
        # Envoyer un message de confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f'Connecté au monitoring IoT du patient {self.patient_id}',
            'timestamp': datetime.now().isoformat()
        }))
    
    async def disconnect(self, close_code):
        # Quitter le groupe de la chambre
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Fermer la session WebSocket
        if hasattr(self, 'session_id'):
            await self.close_websocket_session()
    
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'iot_data':
                await self.handle_iot_data(text_data_json)
            elif message_type == 'device_status':
                await self.handle_device_status(text_data_json)
            elif message_type == 'heartbeat':
                await self.handle_heartbeat()
            else:
                await self.send_error('Type de message non reconnu')
                
        except json.JSONDecodeError:
            await self.send_error('Format JSON invalide')
        except Exception as e:
            logger.error(f"Erreur dans IoTConsumer.receive: {e}")
            await self.send_error('Erreur interne du serveur')
    
    async def handle_iot_data(self, data):
        """Traiter les données reçues des capteurs IoT"""
        try:
            device_mac = data.get('device_mac')
            sensor_data = data.get('sensor_data', [])
            
            if not device_mac or not sensor_data:
                await self.send_error('Données manquantes: device_mac ou sensor_data')
                return
            
            # Vérifier que le dispositif existe
            device = await self.get_device_by_mac(device_mac)
            if not device:
                await self.send_error(f'Dispositif non trouvé: {device_mac}')
                return
            
            # Sauvegarder les données des capteurs
            saved_data = []
            alerts = []
            
            for sensor in sensor_data:
                sensor_type = sensor.get('type')
                value = sensor.get('value')
                unit = sensor.get('unit', '')
                quality = sensor.get('quality', 100)
                
                if sensor_type and value is not None:
                    # Sauvegarder la donnée
                    sensor_record = await self.save_sensor_data(
                        device, sensor_type, value, unit, quality
                    )
                    saved_data.append({
                        'id': sensor_record.donnee_id,
                        'type': sensor_type,
                        'value': float(value),
                        'unit': unit,
                        'timestamp': sensor_record.timestamp.isoformat()
                    })
                    
                    # Vérifier les seuils d'alerte
                    alert = await self.check_alert_thresholds(
                        device, sensor_record, sensor_type, float(value)
                    )
                    if alert:
                        alerts.append(alert)
            
            # Diffuser les données à tous les clients connectés
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'iot_data_update',
                    'data': {
                        'device_mac': device_mac,
                        'device_name': device.nom,
                        'patient_id': str(device.patient.patient_id),
                        'sensor_data': saved_data,
                        'alerts': alerts,
                        'timestamp': datetime.now().isoformat()
                    }
                }
            )
            
            # Confirmer la réception
            await self.send(text_data=json.dumps({
                'type': 'data_received',
                'message': f'{len(saved_data)} données sauvegardées',
                'alerts_count': len(alerts)
            }))
            
        except Exception as e:
            logger.error(f"Erreur lors du traitement des données IoT: {e}")
            await self.send_error('Erreur lors du traitement des données')
    
    async def handle_device_status(self, data):
        """Traiter les mises à jour de statut des dispositifs"""
        try:
            device_mac = data.get('device_mac')
            status = data.get('status')
            firmware_version = data.get('firmware_version')
            
            if device_mac and status:
                await self.update_device_status(device_mac, status, firmware_version)
                
                # Diffuser la mise à jour de statut
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'device_status_update',
                        'data': {
                            'device_mac': device_mac,
                            'status': status,
                            'firmware_version': firmware_version,
                            'timestamp': datetime.now().isoformat()
                        }
                    }
                )
                
        except Exception as e:
            logger.error(f"Erreur lors de la mise à jour du statut: {e}")
    
    async def handle_heartbeat(self):
        """Traiter les signaux de vie (heartbeat)"""
        await self.send(text_data=json.dumps({
            'type': 'heartbeat_ack',
            'timestamp': datetime.now().isoformat()
        }))
    
    # Méthodes pour diffuser les messages
    async def iot_data_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'iot_data_update',
            'data': event['data']
        }))
    
    async def device_status_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'device_status_update',
            'data': event['data']
        }))
    
    async def send_error(self, message):
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': message,
            'timestamp': datetime.now().isoformat()
        }))
    
    # Méthodes d'accès à la base de données
    @database_sync_to_async
    def get_device_by_mac(self, mac_address):
        try:
            return DispositivesIoT.objects.get(adresse_mac=mac_address)
        except DispositivesIoT.DoesNotExist:
            return None
    
    @database_sync_to_async
    def save_sensor_data(self, device, sensor_type, value, unit, quality):
        return DonneesCapteursIoT.objects.create(
            dispositif=device,
            type_capteur=sensor_type,
            valeur=Decimal(str(value)),
            unite=unit,
            qualite_signal=quality
        )
    
    @database_sync_to_async
    def update_device_status(self, mac_address, status, firmware_version=None):
        try:
            device = DispositivesIoT.objects.get(adresse_mac=mac_address)
            device.statut = status
            device.derniere_connexion = datetime.now()
            if firmware_version:
                device.version_firmware = firmware_version
            device.save()
            return device
        except DispositivesIoT.DoesNotExist:
            return None
    
    @database_sync_to_async
    def check_alert_thresholds(self, device, sensor_record, sensor_type, value):
        """Vérifier les seuils d'alerte pour les données des capteurs"""
        alert = None
        
        # Définir les seuils critiques par type de capteur
        thresholds = {
            'temperature': {'critical_high': 39.0, 'critical_low': 35.0},
            'frequence_cardiaque': {'critical_high': 120, 'critical_low': 50},
            'pression_arterielle': {'critical_high': 180, 'critical_low': 90},
            'oxygene_sang': {'critical_low': 90},
        }
        
        if sensor_type in thresholds:
            threshold = thresholds[sensor_type]
            niveau = None
            message = None
            
            if 'critical_high' in threshold and value > threshold['critical_high']:
                niveau = 'critical'
                message = f"{sensor_type} critique: {value} (seuil: {threshold['critical_high']})"
            elif 'critical_low' in threshold and value < threshold['critical_low']:
                niveau = 'critical'
                message = f"{sensor_type} critique: {value} (seuil: {threshold['critical_low']})"
            
            if niveau and message:
                alert = AlertesIoT.objects.create(
                    dispositif=device,
                    donnee=sensor_record,
                    niveau=niveau,
                    titre=f"Alerte {sensor_type}",
                    message=message
                )
                
                return {
                    'id': alert.alerte_id,
                    'niveau': niveau,
                    'titre': alert.titre,
                    'message': message,
                    'timestamp': alert.timestamp.isoformat()
                }
        
        return None
    
    @database_sync_to_async
    def save_websocket_session(self):
        self.session_id = str(uuid.uuid4())
        SessionsWebSocket.objects.create(
            session_id=self.session_id,
            utilisateur=self.scope["user"],
            channel_name=self.channel_name,
            adresse_ip=self.scope.get('client', ['', None])[0]
        )
    
    @database_sync_to_async
    def close_websocket_session(self):
        try:
            session = SessionsWebSocket.objects.get(session_id=self.session_id)
            session.statut = 'fermee'
            session.save()
        except SessionsWebSocket.DoesNotExist:
            pass


class MonitoringConsumer(AsyncWebsocketConsumer):
    """Consumer pour le monitoring en temps réel des patients"""
    
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'monitoring_{self.room_name}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'monitoring_message',
                'message': message
            }
        )
    
    async def monitoring_message(self, event):
        message = event['message']
        
        await self.send(text_data=json.dumps({
            'message': message
        }))


class AlertConsumer(AsyncWebsocketConsumer):
    """Consumer pour les alertes en temps réel"""
    
    async def connect(self):
        self.room_group_name = 'alerts'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        alert_type = text_data_json.get('type')
        
        if alert_type == 'acknowledge_alert':
            alert_id = text_data_json.get('alert_id')
            await self.acknowledge_alert(alert_id)
    
    async def alert_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'alert',
            'data': event['alert_data']
        }))
    
    @database_sync_to_async
    def acknowledge_alert(self, alert_id):
        try:
            alert = AlertesIoT.objects.get(alerte_id=alert_id)
            alert.statut = 'resolue'
            alert.resolu_par = self.scope["user"] if self.scope["user"].is_authenticated else None
            alert.date_resolution = datetime.now()
            alert.save()
        except AlertesIoT.DoesNotExist:
            pass


class ChatConsumer(AsyncWebsocketConsumer):
    """Consumer pour le chat en temps réel entre médecins et patients"""
    
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'timestamp': datetime.now().isoformat()
            }
        )
    
    async def chat_message(self, event):
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']
        
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'username': username,
            'timestamp': timestamp
        }))