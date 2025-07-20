<<<<<<< HEAD
<<<<<<< HEAD
# fajma/permissions.py
from rest_framework import permissions

class IsOwnerOrMedecin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Vérifie que l'utilisateur est authentifié
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Si l'utilisateur est un médecin, il peut accéder aux données des patients
        if request.user.role == 'medecin':
            return True
        # Si l'utilisateur est un patient, il ne peut accéder qu'à ses propres données
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsMedecin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Seuls les médecins peuvent accéder
        return request.user and request.user.is_authenticated and request.user.role == 'medecin'
=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
# fajma/permissions.py
from rest_framework import permissions
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Medecin, Patient

class IsOwnerOrMedecin(permissions.BasePermission):
    """
    Permission personnalisée pour permettre l'accès seulement aux propriétaires des objets ou aux médecins.
    """
    def has_permission(self, request, view):
        # Vérifie que l'utilisateur est authentifié
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Permissions de lecture pour tous les utilisateurs authentifiés
        if request.method in permissions.SAFE_METHODS:
            # Vérifier si l'utilisateur est médecin
            if hasattr(request.user, 'role') and request.user.role == 'medecin':
                return True
            # Vérifier si l'utilisateur est le propriétaire de l'objet
            return obj.user == request.user
        
        # Permissions d'écriture seulement pour le propriétaire ou les médecins
        if hasattr(request.user, 'role') and request.user.role == 'medecin':
            return True
        return obj.user == request.user

class IsMedecin(permissions.BasePermission):
    """
    Permission personnalisée pour permettre l'accès seulement aux médecins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'medecin'

class IsValidToken(permissions.BasePermission):
    """
    Permission personnalisée pour vérifier la validité du token JWT avant les opérations sensibles.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Récupérer le token depuis l'en-tête Authorization
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return False
        
        token = auth_header.split(' ')[1]
        
        try:
            # Vérifier la validité du token
            UntypedToken(token)
            return True
        except (InvalidToken, TokenError):
            return False
<<<<<<< HEAD
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======
# fajma/permissions.py
from rest_framework import permissions

class IsOwnerOrMedecin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Vérifie que l'utilisateur est authentifié
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Si l'utilisateur est un médecin, il peut accéder aux données des patients
        if request.user.role == 'medecin':
            return True
        # Si l'utilisateur est un patient, il ne peut accéder qu'à ses propres données
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsMedecin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Seuls les médecins peuvent accéder
        return request.user and request.user.is_authenticated and request.user.role == 'medecin'
>>>>>>> 692b537 (debut conception dashboard patient)
>>>>>>> fc99c8a (debut conception dashboard patient)
