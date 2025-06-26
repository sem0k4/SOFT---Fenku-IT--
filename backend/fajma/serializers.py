from rest_framework import serializers
from .models import (
    TypesAntecedents, Services, Hopital, HopitalServices, Utilisateur, Medecin,
    Patient, CapteurIoT, Consultation, Ordonnance, Medicaments, LigneOrdonnance,
    Analyses, RadiographieEchographie, Antecedent, Biometrie, CarnetConsultation,
    Facture, RendezVous, Logs, Salle, Lit, Hospitalisation, Ambulance,
    ServiceAccueil, ConseilsSante, DeclarationsNaissance, DocumentsMedicaux,
    Allergie  # Ajouter cette ligne
)

class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Utilisateur(**validated_data)
        user.set_password(password)  # Hacher le mot de passe
        user.save()
        return user

    class Meta:
        model = Utilisateur
        fields = ['user_id', 'username','email', 'password', 'role', 'first_name','last_name','date_joined', 'email_verifie']
        extra_kwargs = {
            'password': {'write_only': True},
        }

class TypesAntecedentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypesAntecedents
        fields = '__all__'

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'

class HopitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hopital
        fields = '__all__'

class HopitalServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HopitalServices
        fields = '__all__'

class MedecinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medecin
        fields = ['medecin_id', 'prenom', 'nom', 'specialite']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['patient_id', 'prenom', 'nom', 'date_naissance', 'sexe', 
                 'numero_identification_national', 'telephone', 'email']

class CapteurIoTSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapteurIoT
        fields = '__all__'

class SignesVitauxSerializer(serializers.Serializer):
    spo2 = serializers.IntegerField(min_value=0, max_value=100)
    heart_rate = serializers.IntegerField(min_value=0, max_value=300)
    blood_pressure = serializers.CharField(max_length=10)

class ConsultationDetailSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    medecin = MedecinSerializer(read_only=True)
    signes_vitaux = SignesVitauxSerializer(required=False)
    
    class Meta:
        model = Consultation
        fields = ['consultation_id', 'patient', 'medecin', 'date_consultation', 
                 'diagnostic', 'notes', 'signes_vitaux']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ajout des signes vitaux depuis les notes si disponibles
        if instance.notes and isinstance(instance.notes, dict):
            representation['signes_vitaux'] = instance.notes.get('signes_vitaux', {})
        return representation

    def create(self, validated_data):
        signes_vitaux = validated_data.pop('signes_vitaux', None)
        if signes_vitaux:
            validated_data['notes'] = {'signes_vitaux': signes_vitaux}
        return super().create(validated_data)

class OrdonnanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ordonnance
        fields = '__all__'

class MedicamentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicaments
        fields = '__all__'

class LigneOrdonnanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneOrdonnance
        fields = '__all__'

class AnalysesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analyses
        fields = '__all__'

class RadiographieEchographieSerializer(serializers.ModelSerializer):
    class Meta:
        model = RadiographieEchographie
        fields = '__all__'

class AntecedentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Antecedent
        fields = '__all__'

class BiometrieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Biometrie
        fields = '__all__'

class CarnetConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarnetConsultation
        fields = '__all__'

class FactureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facture
        fields = '__all__'

class RendezVousDetailSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    medecin = MedecinSerializer(read_only=True)
    
    class Meta:
        model = RendezVous
        fields = ['rdv_id', 'patient', 'medecin', 'date', 'statut']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.patient:
            representation['patient']['full_name'] = f"{instance.patient.prenom} {instance.patient.nom}"
        if instance.medecin:
            representation['medecin']['full_name'] = f"{instance.medecin.prenom} {instance.medecin.nom}"
        return representation

class LogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = '__all__'

class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = '__all__'

class LitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lit
        fields = '__all__'

class HospitalisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospitalisation
        fields = '__all__'

class AmbulanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = '__all__'

class ServiceAccueilSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAccueil
        fields = '__all__'

class ConseilsSanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConseilsSante
        fields = '__all__'

class DeclarationsNaissanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeclarationsNaissance
        fields = '__all__'

class DocumentsMedicauxSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentsMedicaux
        fields = '__all__'

# Ajouter ce serializer à la fin du fichier
class AllergieSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom', read_only=True)
    patient_prenom = serializers.CharField(source='patient.prenom', read_only=True)
    
    class Meta:
        model = Allergie
        fields = ['allergie_id', 'patient', 'patient_nom', 'patient_prenom', 
                 'substance', 'severite', 'date_identification']
        read_only_fields = ['allergie_id']
    
    def validate_severite(self, value):
        severites_valides = ['légère', 'modérée', 'sévère', 'critique']
        if value.lower() not in [s.lower() for s in severites_valides]:
            raise serializers.ValidationError(
                f"La sévérité doit être l'une des valeurs suivantes : {', '.join(severites_valides)}"
            )
        return value
