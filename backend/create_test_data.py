#!/usr/bin/env python
import os
import sys
import django
from datetime import date

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from fajma.models import Utilisateur, Patient, Biometrie

def create_test_data():
    print("Création de données de test...")
    
    # Créer un utilisateur de test s'il n'existe pas
    user, created = Utilisateur.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'patient',
            'email_verifie': True
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Utilisateur créé: {user.username}")
    else:
        # S'assurer que l'email est vérifié
        user.email_verifie = True
        user.save()
        print(f"Utilisateur existant: {user.username}")
    
    # Créer un patient associé à cet utilisateur
    try:
        patient = Patient.objects.get(user=user)
        print(f"Patient existant trouvé: {patient.prenom} {patient.nom}")
    except Patient.DoesNotExist:
        patient = Patient.objects.create(
            prenom='Test',
            nom='Patient',
            date_naissance=date(1990, 1, 1),
            sexe='M',
            rue='123 Rue Test',
            ville='Dakar',
            telephone='+221771234567',
            email='test@example.com',
            user=user
        )
        print(f"Patient créé: {patient.prenom} {patient.nom}")
    
    # Supprimer les anciennes données biométriques de test
    Biometrie.objects.filter(patient=patient).delete()
    
    # Créer des données biométriques de test
    biometries_data = [
        {'poids': 70.5, 'taille': 175, 'groupesanguin': 'O+'},
        {'poids': 68.2, 'taille': 170, 'groupesanguin': 'A+'},
        {'poids': 72.8, 'taille': 180, 'groupesanguin': 'B+'},
        {'poids': 65.0, 'taille': 165, 'groupesanguin': 'AB+'},
        {'poids': 75.3, 'taille': 178, 'groupesanguin': 'O-'},
    ]
    
    for data in biometries_data:
        Biometrie.objects.create(
            patient=patient,
            **data
        )
    
    print(f"Créé {len(biometries_data)} biométries pour le patient {patient.prenom} {patient.nom}")
    
    # Afficher les informations de connexion
    print(f"\nInformations de connexion:")
    print(f"Username: {user.username}")
    print(f"Password: testpass123")
    print(f"Email: {user.email}")
    print(f"Patient ID: {patient.patient_id}")

if __name__ == '__main__':
    create_test_data()