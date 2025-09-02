from rest_framework import viewsets, views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .permissions import IsOwnerOrMedecin, IsMedecin
from .models import (
    TypesAntecedents, Services, Hopital, HopitalServices, Utilisateur, Medecin,
    Patient, CapteurIoT, Consultation, Ordonnance, Medicaments, LigneOrdonnance,
    Analyses, RadiographieEchographie, Antecedent, Biometrie, CarnetConsultation,
    Facture, RendezVous, Logs, Salle, Lit, Hospitalisation, Ambulance,
    ServiceAccueil, ConseilsSante, DeclarationsNaissance, DocumentsMedicaux,
    Allergie  # Ajouter cette ligne
)
from .serializers import (
    TypesAntecedentsSerializer, ServicesSerializer, HopitalSerializer,
    HopitalServicesSerializer, UtilisateurSerializer, MedecinSerializer,
    PatientSerializer, CapteurIoTSerializer, ConsultationDetailSerializer,
    OrdonnanceSerializer, MedicamentsSerializer, LigneOrdonnanceSerializer,
    AnalysesSerializer, RadiographieEchographieSerializer, AntecedentSerializer,
    BiometrieSerializer, CarnetConsultationSerializer, FactureSerializer,
    RendezVousDetailSerializer, LogsSerializer, SalleSerializer, LitSerializer,
    HospitalisationSerializer, AmbulanceSerializer, ServiceAccueilSerializer,
    ConseilsSanteSerializer, DeclarationsNaissanceSerializer,
    DocumentsMedicauxSerializer, AllergieSerializer  # Ajouter cette ligne
)

# Vue de test pour vérifier l'authentification JWT et le rôle
class TestAuthView(views.APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_active:
            return Response({"error": "Utilisateur inactif"}, status=status.HTTP_403_FORBIDDEN)
        
        # Vérifier le rôle (exemple : accès réservé aux médecins)
        if user.role != 'medecin':
            return Response({"error": "Accès réservé aux médecins"}, status=status.HTTP_403_FORBIDDEN)
        
        return Response({
            "message": "Authentification réussie !",
            "user": {
                "username": user.username,
                "role": user.role,
                "email": user.email,
                "email_verifie": user.email_verifie
            }
        }, status=status.HTTP_200_OK)

# ViewSets avec restrictions d'accès
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Patient.objects.all()  # Médecins voient tous les patients
        elif user.role == 'patient':
            return Patient.objects.filter(user=user)  # Patients voient leurs données
        return Patient.objects.none()  # Aucun accès pour autres rôles

class MedecinViewSet(viewsets.ModelViewSet):
    queryset = Medecin.objects.all()
    serializer_class = MedecinSerializer
    permission_classes = [IsAuthenticated, IsMedecin]

    def get_queryset(self):
        return Medecin.objects.filter(user=self.request.user)  # Médecins voient leurs données

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Consultation.objects.filter(medecin__user=user)  # Médecins voient leurs consultations
        elif user.role == 'patient':
            return Consultation.objects.filter(patient__user=user)  # Patients voient leurs consultations
        return Consultation.objects.none()

class RendezVousViewSet(viewsets.ModelViewSet):
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousDetailSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return RendezVous.objects.filter(medecin__user=user)
        elif user.role == 'patient':
            return RendezVous.objects.filter(patient__user=user)
        return RendezVous.objects.none()

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'patient':
            return Response(
                {"error": "Seuls les patients peuvent prendre des rendez-vous"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Récupérer le patient associé à l'utilisateur
        try:
            patient = Patient.objects.get(user=user)
        except Patient.DoesNotExist:
            return Response(
                {"error": "Patient non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Ajouter automatiquement le patient à la requête
        request.data['patient'] = patient.patient_id
        
        # Vérifier si le médecin existe
        try:
            medecin = Medecin.objects.get(pk=request.data.get('medecin'))
        except Medecin.DoesNotExist:
            return Response(
                {"error": "Médecin non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Créer le rendez-vous
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AntecedentViewSet(viewsets.ModelViewSet):
    queryset = Antecedent.objects.all()
    serializer_class = AntecedentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Antecedent.objects.all()  # Médecins voient tous les antécédents
        elif user.role == 'patient':
            return Antecedent.objects.filter(patient__user=user)  # Patients voient leurs antécédents
        return Antecedent.objects.none()

class BiometrieViewSet(viewsets.ModelViewSet):
    queryset = Biometrie.objects.all()
    serializer_class = BiometrieSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Biometrie.objects.all()  # Médecins voient toutes les biométries
        elif user.role == 'patient':
            return Biometrie.objects.filter(patient__user=user)  # Patients voient leurs biométries
        return Biometrie.objects.none()

class DocumentsMedicauxViewSet(viewsets.ModelViewSet):
    queryset = DocumentsMedicaux.objects.all()
    serializer_class = DocumentsMedicauxSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return DocumentsMedicaux.objects.all()  # Médecins voient tous les documents
        elif user.role == 'patient':
            return DocumentsMedicaux.objects.filter(patient__user=user)  # Patients voient leurs documents
        return DocumentsMedicaux.objects.none()

class CapteurIoTViewSet(viewsets.ModelViewSet):
    queryset = CapteurIoT.objects.all()
    serializer_class = CapteurIoTSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return CapteurIoT.objects.all()  # Médecins voient toutes les données IoT
        elif user.role == 'patient':
            return CapteurIoT.objects.filter(patient__user=user)  # Patients voient leurs données IoT
        return CapteurIoT.objects.none()

class OrdonnanceViewSet(viewsets.ModelViewSet):
    queryset = Ordonnance.objects.all()
    serializer_class = OrdonnanceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Ordonnance.objects.filter(consultation__medecin__user=user)
        elif user.role == 'patient':
            return Ordonnance.objects.filter(consultation__patient__user=user)
        return Ordonnance.objects.none()

class LigneOrdonnanceViewSet(viewsets.ModelViewSet):
    queryset = LigneOrdonnance.objects.all()
    serializer_class = LigneOrdonnanceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return LigneOrdonnance.objects.filter(ordonnance__consultation__medecin__user=user)
        elif user.role == 'patient':
            return LigneOrdonnance.objects.filter(ordonnance__consultation__patient__user=user)
        return LigneOrdonnance.objects.none()

class FactureViewSet(viewsets.ModelViewSet):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Facture.objects.all()  # Médecins voient toutes les factures
        elif user.role == 'patient':
            return Facture.objects.filter(patient__user=user)  # Patients voient leurs factures
        return Facture.objects.none()

class CarnetConsultationViewSet(viewsets.ModelViewSet):
    queryset = CarnetConsultation.objects.all()
    serializer_class = CarnetConsultationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return CarnetConsultation.objects.all()  # Médecins voient tous les carnets
        elif user.role == 'patient':
            return CarnetConsultation.objects.filter(patient__user=user)
        return CarnetConsultation.objects.none()

class AnalysesViewSet(viewsets.ModelViewSet):
    queryset = Analyses.objects.all()
    serializer_class = AnalysesSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return Analyses.objects.all()
        elif user.role == 'patient':
            return Analyses.objects.filter(patient__user=user)
        return Analyses.objects.none()

class RadiographieEchographieViewSet(viewsets.ModelViewSet):
    queryset = RadiographieEchographie.objects.all()
    serializer_class = RadiographieEchographieSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'medecin':
            return RadiographieEchographie.objects.all()
        elif user.role == 'patient':
            return RadiographieEchographie.objects.filter(patient__user=user)
        return RadiographieEchographie.objects.none()

# ViewSets pour ressources génériques ou administratives
class TypesAntecedentsViewSet(viewsets.ModelViewSet):
    queryset = TypesAntecedents.objects.all()
    serializer_class = TypesAntecedentsSerializer
    permission_classes = [IsAuthenticated, IsMedecin]  # Réservé aux médecins

class ServicesViewSet(viewsets.ModelViewSet):
    queryset = Services.objects.all()
    serializer_class = ServicesSerializer
    permission_classes = [IsAuthenticated, IsMedecin]  # Réservé aux médecins

class HopitalViewSet(viewsets.ModelViewSet):
    queryset = Hopital.objects.all()
    serializer_class = HopitalSerializer
    permission_classes = [IsAuthenticated]  # Réservé aux médecins

class HopitalServicesViewSet(viewsets.ModelViewSet):
    queryset = HopitalServices.objects.all()
    serializer_class = HopitalServicesSerializer
    permission_classes = [IsAuthenticated, IsMedecin]  # Réservé aux médecins

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAuthenticated, IsMedecin]  # Réservé aux médecins pour gérer les utilisateurs

class MedicamentsViewSet(viewsets.ModelViewSet):
    queryset = Medicaments.objects.all()
    serializer_class = MedicamentsSerializer
    permission_classes = [IsAuthenticated, IsMedecin]  # Réservé aux médecins

class SalleViewSet(viewsets.ModelViewSet):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer
    permission_classes = [IsAuthenticated, IsMedecin]

class LitViewSet(viewsets.ModelViewSet):
    queryset = Lit.objects.all()
    serializer_class = LitSerializer
    permission_classes = [IsAuthenticated, IsMedecin]

class HospitalisationViewSet(viewsets.ModelViewSet):
    queryset = Hospitalisation.objects.all()
    serializer_class = HospitalisationSerializer
    permission_classes = [IsAuthenticated, IsMedecin]

class AmbulanceViewSet(viewsets.ModelViewSet):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer
    permission_classes = [IsAuthenticated, IsMedecin]

class ServiceAccueilViewSet(viewsets.ModelViewSet):
    queryset = ServiceAccueil.objects.all()
    serializer_class = ServiceAccueilSerializer
    permission_classes = [IsAuthenticated, IsMedecin]

class ConseilsSanteViewSet(viewsets.ModelViewSet):
    queryset = ConseilsSante.objects.all()
    serializer_class = ConseilsSanteSerializer
    permission_classes = [IsAuthenticated]  # Accessible à tous (conseils généraux)

class DeclarationsNaissanceViewSet(viewsets.ModelViewSet):
    queryset = DeclarationsNaissance.objects.all()
    serializer_class = DeclarationsNaissanceSerializer
    permission_classes = [IsAuthenticated, IsMedecin]

class LogsViewSet(viewsets.ModelViewSet):
    queryset = Logs.objects.all()
    serializer_class = LogsSerializer 
    permission_classes = [IsAuthenticated, IsMedecin]  # Réservé aux médecins pour audit

# Ajouter cette vue à la fin du fichier, avant la dernière ligne
class AllergieViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les allergies des patients.
    Permet de créer, lire, modifier et supprimer les allergies.
    """
    queryset = Allergie.objects.all()
    serializer_class = AllergieSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrMedecin]
    
    def get_queryset(self):
        """
        Filtrer les allergies selon le rôle de l'utilisateur.
        - Médecins : peuvent voir toutes les allergies
        - Patients : peuvent voir seulement leurs propres allergies
        """
        user = self.request.user
        
        if user.role == 'medecin':
            # Les médecins peuvent voir toutes les allergies
            queryset = Allergie.objects.all()
        elif user.role == 'patient':
            # Les patients ne voient que leurs propres allergies
            try:
                patient = Patient.objects.get(user=user)
                queryset = Allergie.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                queryset = Allergie.objects.none()
        else:
            # Autres rôles n'ont pas accès
            queryset = Allergie.objects.none()
        
        # Filtrage par patient si spécifié dans les paramètres
        patient_id = self.request.query_params.get('patient', None)
        if patient_id is not None and user.role == 'medecin':
            queryset = queryset.filter(patient_id=patient_id)
        
        # Filtrage par substance
        substance = self.request.query_params.get('substance', None)
        if substance is not None:
            queryset = queryset.filter(substance__icontains=substance)
        
        # Filtrage par sévérité
        severite = self.request.query_params.get('severite', None)
        if severite is not None:
            queryset = queryset.filter(severite__icontains=severite)
        
        return queryset.select_related('patient').order_by('-date_identification')
    
    def perform_create(self, serializer):
        """
        Créer une nouvelle allergie.
        Si l'utilisateur est un patient, l'allergie lui est automatiquement assignée.
        """
        user = self.request.user
        
        if user.role == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                serializer.save(patient=patient)
            except Patient.DoesNotExist:
                raise serializers.ValidationError("Profil patient non trouvé.")
        else:
            # Pour les médecins, le patient doit être spécifié
            serializer.save()
