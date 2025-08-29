from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from datetime import datetime, timedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

from .models import (
    DispositivesIoT, DonneesCapteursIoT, AlertesIoT, 
    SessionsWebSocket, Patient
)
from .serializers_iot import (
    DispositivesIoTSerializer, DonneesCapteursIoTSerializer,
    AlertesIoTSerializer, SessionsWebSocketSerializer
)


class DispositivesIoTViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les dispositifs IoT"""
    queryset = DispositivesIoT.objects.all()
    serializer_class = DispositivesIoTSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = DispositivesIoT.objects.all()
        patient_id = self.request.query_params.get('patient_id')
        statut = self.request.query_params.get('statut')
        type_dispositif = self.request.query_params.get('type')
        
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if statut:
            queryset = queryset.filter(statut=statut)
        if type_dispositif:
            queryset = queryset.filter(type_dispositif=type_dispositif)
            
        return queryset.order_by('-date_installation')
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Mettre à jour le statut d'un dispositif"""
        dispositif = self.get_object()
        new_status = request.data.get('statut')
        
        if new_status not in ['actif', 'inactif', 'en_panne', 'maintenance']:
            return Response(
                {'error': 'Statut invalide'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        dispositif.statut = new_status
        dispositif.save()
        
        # Notifier via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'iot_patient_{dispositif.patient.patient_id}',
            {
                'type': 'device_status_update',
                'data': {
                    'device_mac': dispositif.adresse_mac,
                    'device_name': dispositif.nom,
                    'status': new_status,
                    'timestamp': datetime.now().isoformat()
                }
            }
        )
        
        return Response({
            'message': 'Statut mis à jour avec succès',
            'dispositif': DispositivesIoTSerializer(dispositif).data
        })
    
    @action(detail=True, methods=['get'])
    def latest_data(self, request, pk=None):
        """Obtenir les dernières données d'un dispositif"""
        dispositif = self.get_object()
        limit = int(request.query_params.get('limit', 10))
        
        latest_data = DonneesCapteursIoT.objects.filter(
            dispositif=dispositif
        ).order_by('-timestamp')[:limit]
        
        serializer = DonneesCapteursIoTSerializer(latest_data, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_command(self, request, pk=None):
        """Envoyer une commande à un dispositif ESP32"""
        dispositif = self.get_object()
        command = request.data.get('command')
        parameters = request.data.get('parameters', {})
        
        if not command:
            return Response(
                {'error': 'Commande requise'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Envoyer la commande via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'iot_patient_{dispositif.patient.patient_id}',
            {
                'type': 'device_command',
                'data': {
                    'device_mac': dispositif.adresse_mac,
                    'command': command,
                    'parameters': parameters,
                    'timestamp': datetime.now().isoformat()
                }
            }
        )
        
        return Response({
            'message': 'Commande envoyée avec succès',
            'command': command,
            'device': dispositif.nom
        })


class DonneesCapteursIoTViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour consulter les données des capteurs IoT"""
    queryset = DonneesCapteursIoT.objects.all()
    serializer_class = DonneesCapteursIoTSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = DonneesCapteursIoT.objects.all()
        dispositif_id = self.request.query_params.get('dispositif_id')
        patient_id = self.request.query_params.get('patient_id')
        type_capteur = self.request.query_params.get('type_capteur')
        date_debut = self.request.query_params.get('date_debut')
        date_fin = self.request.query_params.get('date_fin')
        
        if dispositif_id:
            queryset = queryset.filter(dispositif_id=dispositif_id)
        if patient_id:
            queryset = queryset.filter(dispositif__patient_id=patient_id)
        if type_capteur:
            queryset = queryset.filter(type_capteur=type_capteur)
        if date_debut:
            queryset = queryset.filter(timestamp__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(timestamp__lte=date_fin)
            
        return queryset.order_by('-timestamp')
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Obtenir des statistiques sur les données des capteurs"""
        patient_id = request.query_params.get('patient_id')
        type_capteur = request.query_params.get('type_capteur')
        period = request.query_params.get('period', '24h')  # 24h, 7d, 30d
        
        # Calculer la période
        if period == '24h':
            start_date = datetime.now() - timedelta(hours=24)
        elif period == '7d':
            start_date = datetime.now() - timedelta(days=7)
        elif period == '30d':
            start_date = datetime.now() - timedelta(days=30)
        else:
            start_date = datetime.now() - timedelta(hours=24)
        
        queryset = DonneesCapteursIoT.objects.filter(
            timestamp__gte=start_date
        )
        
        if patient_id:
            queryset = queryset.filter(dispositif__patient_id=patient_id)
        if type_capteur:
            queryset = queryset.filter(type_capteur=type_capteur)
        
        # Calculer les statistiques
        from django.db.models import Avg, Max, Min, Count
        stats = queryset.aggregate(
            count=Count('donnee_id'),
            avg_value=Avg('valeur'),
            max_value=Max('valeur'),
            min_value=Min('valeur')
        )
        
        return Response({
            'period': period,
            'start_date': start_date.isoformat(),
            'statistics': stats,
            'patient_id': patient_id,
            'type_capteur': type_capteur
        })
    
    @action(detail=False, methods=['get'])
    def real_time_data(self, request):
        """Obtenir les données en temps réel (dernières 5 minutes)"""
        patient_id = request.query_params.get('patient_id')
        
        if not patient_id:
            return Response(
                {'error': 'patient_id requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Données des 5 dernières minutes
        start_time = datetime.now() - timedelta(minutes=5)
        
        recent_data = DonneesCapteursIoT.objects.filter(
            dispositif__patient_id=patient_id,
            timestamp__gte=start_time
        ).order_by('-timestamp')
        
        serializer = DonneesCapteursIoTSerializer(recent_data, many=True)
        return Response({
            'patient_id': patient_id,
            'start_time': start_time.isoformat(),
            'data_count': len(serializer.data),
            'data': serializer.data
        })


class AlertesIoTViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les alertes IoT"""
    queryset = AlertesIoT.objects.all()
    serializer_class = AlertesIoTSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = AlertesIoT.objects.all()
        patient_id = self.request.query_params.get('patient_id')
        niveau = self.request.query_params.get('niveau')
        statut = self.request.query_params.get('statut')
        
        if patient_id:
            queryset = queryset.filter(dispositif__patient_id=patient_id)
        if niveau:
            queryset = queryset.filter(niveau=niveau)
        if statut:
            queryset = queryset.filter(statut=statut)
            
        return queryset.order_by('-timestamp')
    
    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """Acquitter une alerte"""
        alerte = self.get_object()
        
        if alerte.statut != 'active':
            return Response(
                {'error': 'Cette alerte a déjà été traitée'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        alerte.statut = 'resolue'
        alerte.resolu_par = request.user
        alerte.date_resolution = datetime.now()
        alerte.save()
        
        # Notifier via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'alerts',
            {
                'type': 'alert_acknowledged',
                'data': {
                    'alert_id': alerte.alerte_id,
                    'resolved_by': request.user.username,
                    'timestamp': datetime.now().isoformat()
                }
            }
        )
        
        return Response({
            'message': 'Alerte acquittée avec succès',
            'alerte': AlertesIoTSerializer(alerte).data
        })
    
    @action(detail=False, methods=['get'])
    def active_alerts(self, request):
        """Obtenir toutes les alertes actives"""
        active_alerts = AlertesIoT.objects.filter(
            statut='active'
        ).order_by('-timestamp')
        
        serializer = AlertesIoTSerializer(active_alerts, many=True)
        return Response({
            'count': len(serializer.data),
            'alerts': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def critical_alerts(self, request):
        """Obtenir les alertes critiques"""
        critical_alerts = AlertesIoT.objects.filter(
            niveau__in=['critical', 'emergency'],
            statut='active'
        ).order_by('-timestamp')
        
        serializer = AlertesIoTSerializer(critical_alerts, many=True)
        return Response({
            'count': len(serializer.data),
            'critical_alerts': serializer.data
        })


class SessionsWebSocketViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour consulter les sessions WebSocket actives"""
    queryset = SessionsWebSocket.objects.all()
    serializer_class = SessionsWebSocketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = SessionsWebSocket.objects.all()
        statut = self.request.query_params.get('statut', 'active')
        
        if statut:
            queryset = queryset.filter(statut=statut)
            
        return queryset.order_by('-date_connexion')
    
    @action(detail=False, methods=['get'])
    def active_sessions(self, request):
        """Obtenir toutes les sessions actives"""
        active_sessions = SessionsWebSocket.objects.filter(
            statut='active'
        ).order_by('-derniere_activite')
        
        serializer = SessionsWebSocketSerializer(active_sessions, many=True)
        return Response({
            'count': len(serializer.data),
            'sessions': serializer.data
        })