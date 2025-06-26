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