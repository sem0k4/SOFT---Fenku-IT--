from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny

# Puis, quelque part dans votre code, assurez-vous que ces vues sont configurées avec AllowAny
TokenObtainPairView.permission_classes = [AllowAny]
TokenRefreshView.permission_classes = [AllowAny]
from .views import (
    TypesAntecedentsViewSet, ServicesViewSet, HopitalViewSet,
    HopitalServicesViewSet, UtilisateurViewSet, MedecinViewSet,
    PatientViewSet, CapteurIoTViewSet, ConsultationViewSet,
    OrdonnanceViewSet, MedicamentsViewSet, LigneOrdonnanceViewSet,
    AnalysesViewSet, RadiographieEchographieViewSet, AntecedentViewSet,
    BiometrieViewSet, CarnetConsultationViewSet, FactureViewSet,
    RendezVousViewSet, LogsViewSet, SalleViewSet, LitViewSet,
    HospitalisationViewSet, AmbulanceViewSet, ServiceAccueilViewSet,
    ConseilsSanteViewSet, DeclarationsNaissanceViewSet,
    DocumentsMedicauxViewSet, TestAuthView
)
from .auth_views import (
    RegisterView, LoginView, UserProfileView, LogoutView, ConfirmEmailView,
    RequestPasswordResetView, VerifyResetCodeView, SetNewPasswordView, ResendConfirmationEmailView
)

router = DefaultRouter()

# Enregistrer tous les ViewSets AVANT de définir les urlpatterns
router.register(r'types-antecedents', TypesAntecedentsViewSet)
router.register(r'services', ServicesViewSet)
router.register(r'hopitaux', HopitalViewSet)
router.register(r'hopital-services', HopitalServicesViewSet)
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'medecins', MedecinViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'capteurs', CapteurIoTViewSet)
router.register(r'consultations', ConsultationViewSet)
router.register(r'ordonnances', OrdonnanceViewSet)
router.register(r'medicaments', MedicamentsViewSet)
router.register(r'lignes-ordonnance', LigneOrdonnanceViewSet)
router.register(r'analyses', AnalysesViewSet)
router.register(r'radiographies', RadiographieEchographieViewSet)
router.register(r'antecedents', AntecedentViewSet)
router.register(r'biometries', BiometrieViewSet)
router.register(r'carnets', CarnetConsultationViewSet)
router.register(r'factures', FactureViewSet)
router.register(r'rendez-vous', RendezVousViewSet)
router.register(r'logs', LogsViewSet)
router.register(r'salles', SalleViewSet)
router.register(r'lits', LitViewSet)
router.register(r'hospitalisations', HospitalisationViewSet)
router.register(r'ambulances', AmbulanceViewSet)
router.register(r'services-accueil', ServiceAccueilViewSet)
router.register(r'conseils', ConseilsSanteViewSet)
router.register(r'declarations', DeclarationsNaissanceViewSet)
router.register(r'documents', DocumentsMedicauxViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # URLs IoT
    path('', include('fajma.urls_iot')),
    
    # URLs d'authentification
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/confirm-email/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
    path('auth/resend-confirmation-email/', ResendConfirmationEmailView.as_view(), name='resend-confirmation-email'),
    path('auth/request-password-reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('auth/verify-reset-code/', VerifyResetCodeView.as_view(), name='verify-reset-code'),
    path('auth/set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('test-auth/', TestAuthView.as_view(), name='test-auth'),
]

# Suppression des routes dupliquées à la fin du fichier