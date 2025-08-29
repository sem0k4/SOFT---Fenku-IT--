from rest_framework import serializers
from .models import (
    DispositivesIoT, DonneesCapteursIoT, AlertesIoT, 
    SessionsWebSocket, Patient, Utilisateur
)


class DispositivesIoTSerializer(serializers.ModelSerializer):
    """Serializer pour les dispositifs IoT"""
    patient_nom = serializers.CharField(source='patient.nom', read_only=True)
    patient_prenom = serializers.CharField(source='patient.prenom', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    type_dispositif_display = serializers.CharField(source='get_type_dispositif_display', read_only=True)
    
    class Meta:
        model = DispositivesIoT
        fields = [
            'dispositif_id', 'patient', 'patient_nom', 'patient_prenom',
            'nom', 'type_dispositif', 'type_dispositif_display',
            'adresse_mac', 'adresse_ip', 'statut', 'statut_display',
            'date_installation', 'derniere_connexion', 'version_firmware',
            'localisation'
        ]
        read_only_fields = ['dispositif_id', 'date_installation']
    
    def validate_adresse_mac(self, value):
        """Valider le format de l'adresse MAC"""
        import re
        mac_pattern = r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'
        if not re.match(mac_pattern, value):
            raise serializers.ValidationError(
                "Format d'adresse MAC invalide. Utilisez le format XX:XX:XX:XX:XX:XX"
            )
        return value.upper()
    
    def validate_adresse_ip(self, value):
        """Valider l'adresse IP"""
        if value:
            import ipaddress
            try:
                ipaddress.ip_address(value)
            except ValueError:
                raise serializers.ValidationError("Adresse IP invalide")
        return value


class DonneesCapteursIoTSerializer(serializers.ModelSerializer):
    """Serializer pour les données des capteurs IoT"""
    dispositif_nom = serializers.CharField(source='dispositif.nom', read_only=True)
    patient_id = serializers.IntegerField(source='dispositif.patient.patient_id', read_only=True)
    patient_nom = serializers.CharField(source='dispositif.patient.nom', read_only=True)
    type_capteur_display = serializers.CharField(source='get_type_capteur_display', read_only=True)
    
    class Meta:
        model = DonneesCapteursIoT
        fields = [
            'donnee_id', 'dispositif', 'dispositif_nom', 'patient_id', 'patient_nom',
            'type_capteur', 'type_capteur_display', 'valeur', 'unite',
            'timestamp', 'qualite_signal'
        ]
        read_only_fields = ['donnee_id', 'timestamp']
    
    def validate_valeur(self, value):
        """Valider la valeur du capteur"""
        if value < 0:
            raise serializers.ValidationError("La valeur ne peut pas être négative")
        return value
    
    def validate_qualite_signal(self, value):
        """Valider la qualité du signal"""
        if not 0 <= value <= 100:
            raise serializers.ValidationError("La qualité du signal doit être entre 0 et 100")
        return value


class AlertesIoTSerializer(serializers.ModelSerializer):
    """Serializer pour les alertes IoT"""
    dispositif_nom = serializers.CharField(source='dispositif.nom', read_only=True)
    patient_id = serializers.IntegerField(source='dispositif.patient.patient_id', read_only=True)
    patient_nom = serializers.CharField(source='dispositif.patient.nom', read_only=True)
    niveau_display = serializers.CharField(source='get_niveau_display', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    resolu_par_username = serializers.CharField(source='resolu_par.username', read_only=True)
    donnee_valeur = serializers.DecimalField(
        source='donnee.valeur', max_digits=10, decimal_places=3, read_only=True
    )
    donnee_unite = serializers.CharField(source='donnee.unite', read_only=True)
    
    class Meta:
        model = AlertesIoT
        fields = [
            'alerte_id', 'dispositif', 'dispositif_nom', 'patient_id', 'patient_nom',
            'donnee', 'donnee_valeur', 'donnee_unite', 'niveau', 'niveau_display',
            'titre', 'message', 'statut', 'statut_display', 'timestamp',
            'resolu_par', 'resolu_par_username', 'date_resolution'
        ]
        read_only_fields = [
            'alerte_id', 'timestamp', 'resolu_par', 'date_resolution'
        ]
    
    def validate_niveau(self, value):
        """Valider le niveau d'alerte"""
        valid_levels = ['info', 'warning', 'critical', 'emergency']
        if value not in valid_levels:
            raise serializers.ValidationError(
                f"Niveau invalide. Choisissez parmi: {', '.join(valid_levels)}"
            )
        return value


class SessionsWebSocketSerializer(serializers.ModelSerializer):
    """Serializer pour les sessions WebSocket"""
    utilisateur_username = serializers.CharField(source='utilisateur.username', read_only=True)
    utilisateur_role = serializers.CharField(source='utilisateur.role', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    duree_connexion = serializers.SerializerMethodField()
    
    class Meta:
        model = SessionsWebSocket
        fields = [
            'session_id', 'utilisateur', 'utilisateur_username', 'utilisateur_role',
            'channel_name', 'date_connexion', 'derniere_activite',
            'statut', 'statut_display', 'adresse_ip', 'user_agent',
            'duree_connexion'
        ]
        read_only_fields = [
            'session_id', 'date_connexion', 'derniere_activite'
        ]
    
    def get_duree_connexion(self, obj):
        """Calculer la durée de connexion"""
        from datetime import datetime
        if obj.statut == 'active':
            duree = datetime.now() - obj.date_connexion.replace(tzinfo=None)
        elif obj.derniere_activite:
            duree = obj.derniere_activite.replace(tzinfo=None) - obj.date_connexion.replace(tzinfo=None)
        else:
            return None
        
        total_seconds = int(duree.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


class PatientIoTSummarySerializer(serializers.ModelSerializer):
    """Serializer pour le résumé IoT d'un patient"""
    dispositifs_count = serializers.SerializerMethodField()
    dispositifs_actifs = serializers.SerializerMethodField()
    derniere_donnee = serializers.SerializerMethodField()
    alertes_actives = serializers.SerializerMethodField()
    
    class Meta:
        model = Patient
        fields = [
            'patient_id', 'prenom', 'nom', 'dispositifs_count',
            'dispositifs_actifs', 'derniere_donnee', 'alertes_actives'
        ]
    
    def get_dispositifs_count(self, obj):
        """Nombre total de dispositifs"""
        return DispositivesIoT.objects.filter(patient=obj).count()
    
    def get_dispositifs_actifs(self, obj):
        """Nombre de dispositifs actifs"""
        return DispositivesIoT.objects.filter(
            patient=obj, statut='actif'
        ).count()
    
    def get_derniere_donnee(self, obj):
        """Dernière donnée reçue"""
        derniere = DonneesCapteursIoT.objects.filter(
            dispositif__patient=obj
        ).order_by('-timestamp').first()
        
        if derniere:
            return {
                'timestamp': derniere.timestamp,
                'type_capteur': derniere.type_capteur,
                'valeur': derniere.valeur,
                'unite': derniere.unite,
                'dispositif': derniere.dispositif.nom
            }
        return None
    
    def get_alertes_actives(self, obj):
        """Nombre d'alertes actives"""
        return AlertesIoT.objects.filter(
            dispositif__patient=obj, statut='active'
        ).count()


class DispositivesIoTCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un nouveau dispositif IoT"""
    
    class Meta:
        model = DispositivesIoT
        fields = [
            'patient', 'nom', 'type_dispositif', 'adresse_mac',
            'adresse_ip', 'version_firmware', 'localisation'
        ]
    
    def validate_adresse_mac(self, value):
        """Valider l'unicité de l'adresse MAC"""
        import re
        mac_pattern = r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'
        if not re.match(mac_pattern, value):
            raise serializers.ValidationError(
                "Format d'adresse MAC invalide. Utilisez le format XX:XX:XX:XX:XX:XX"
            )
        
        value = value.upper()
        if DispositivesIoT.objects.filter(adresse_mac=value).exists():
            raise serializers.ValidationError(
                "Un dispositif avec cette adresse MAC existe déjà"
            )
        
        return value
    
    def create(self, validated_data):
        """Créer un nouveau dispositif avec statut actif par défaut"""
        validated_data['statut'] = 'actif'
        return super().create(validated_data)


class DonneesCapteursIoTBulkSerializer(serializers.Serializer):
    """Serializer pour l'insertion en lot de données de capteurs"""
    device_mac = serializers.CharField(max_length=17)
    sensor_data = serializers.ListField(
        child=serializers.DictField()
    )
    
    def validate_device_mac(self, value):
        """Valider que le dispositif existe"""
        try:
            DispositivesIoT.objects.get(adresse_mac=value.upper())
        except DispositivesIoT.DoesNotExist:
            raise serializers.ValidationError(
                f"Aucun dispositif trouvé avec l'adresse MAC: {value}"
            )
        return value.upper()
    
    def validate_sensor_data(self, value):
        """Valider les données des capteurs"""
        required_fields = ['type', 'value', 'unit']
        
        for sensor in value:
            for field in required_fields:
                if field not in sensor:
                    raise serializers.ValidationError(
                        f"Champ manquant '{field}' dans les données du capteur"
                    )
            
            # Valider le type de capteur
            valid_types = [
                'temperature', 'humidite', 'pression_arterielle',
                'frequence_cardiaque', 'oxygene_sang', 'glucose',
                'poids', 'mouvement', 'autre'
            ]
            if sensor['type'] not in valid_types:
                raise serializers.ValidationError(
                    f"Type de capteur invalide: {sensor['type']}"
                )
            
            # Valider la valeur
            try:
                float(sensor['value'])
            except (ValueError, TypeError):
                raise serializers.ValidationError(
                    f"Valeur invalide pour le capteur {sensor['type']}: {sensor['value']}"
                )
        
        return value