import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import (
    Utilisateur, Patient, Medecin, Consultation, Ordonnance, Medicaments
)
from django.core.exceptions import ObjectDoesNotExist
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class ConsultationConsumer(AsyncWebsocketConsumer):
    """Consumer pour les consultations en temps réel"""
    
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return
        
        self.consultation_id = self.scope['url_route']['kwargs']['consultation_id']
        self.room_group_name = f'consultation_{self.consultation_id}'
        
        # Vérifier les permissions
        try:
            consultation = await database_sync_to_async(Consultation.objects.get)(consultation_id=self.consultation_id)
            if not await self.has_permission(consultation):
                await self.close()
                return
        except Consultation.DoesNotExist:
            await self.close()
            return
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        logger.info(f"Connexion WebSocket établie pour la consultation {self.consultation_id}")
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        logger.info(f"Connexion WebSocket fermée pour la consultation {self.consultation_id}")
    
    async def receive(self, text_data):
        """Recevoir les messages de consultation"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'consultation_message':
                await self.handle_consultation_message(data)
            elif message_type == 'heartbeat':
                await self.send(text_data=json.dumps({
                    'type': 'heartbeat_response',
                    'timestamp': datetime.now().isoformat()
                }))
            else:
                logger.warning(f"Type de message non reconnu: {message_type}")
                
        except json.JSONDecodeError as e:
            logger.error(f"Erreur de décodage JSON: {str(e)}")
        except Exception as e:
            logger.error(f"Erreur lors du traitement du message: {str(e)}")
    
    async def handle_consultation_message(self, data):
        """Traiter les messages de consultation"""
        try:
            message = data.get('message', '')
            sender_id = data.get('sender_id')
            
            # Diffuser le message aux autres participants
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'consultation_message_update',
                    'message': message,
                    'sender_id': sender_id,
                    'timestamp': datetime.now().isoformat()
                }
            )
            
        except Exception as e:
            logger.error(f"Erreur lors du traitement du message de consultation: {e}")
    
    async def consultation_message_update(self, event):
        """Envoyer les messages de consultation aux clients WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'consultation_message',
            'message': event['message'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp']
        }))
    
    @database_sync_to_async
    def has_permission(self, consultation):
        """Vérifier si l'utilisateur a les permissions pour cette consultation"""
        user = self.scope["user"]
        
        # Le médecin de la consultation peut y accéder
        if hasattr(user, 'medecin') and consultation.medecin == user.medecin:
            return True
        
        # Le patient de la consultation peut y accéder
        if hasattr(user, 'patient') and consultation.patient == user.patient:
            return True
        
        return False