#!/usr/bin/env python
import os
import sys
import django
import requests
import json

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.core.settings')
sys.path.append('backend')
django.setup()

from backend.fajma.models import Utilisateur, Patient, Biometrie
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

def debug_biometrics():
    print("=== DÉBOGAGE DES DONNÉES BIOMÉTRIQUES ===")
    
    # 1. Vérifier les données dans la base de données
    print("\n1. Vérification des données en base:")
    users = Utilisateur.objects.filter(role='patient')
    print(f"Nombre d'utilisateurs patients: {users.count()}")
    
    for user in users:
        print(f"  - Utilisateur: {user.username} ({user.email})")
        try:
            patient = Patient.objects.get(user=user)
            print(f"    Patient: {patient.prenom} {patient.nom} (ID: {patient.patient_id})")
            
            biometries = Biometrie.objects.filter(patient=patient)
            print(f"    Biométries: {biometries.count()}")
            
            for bio in biometries:
                print(f"      - ID: {bio.biometrie_id}, Poids: {bio.poids}, Taille: {bio.taille}, Groupe: {bio.groupesanguin}")
                
        except Patient.DoesNotExist:
            print(f"    Aucun patient associé à cet utilisateur")
    
    # 2. Tester l'authentification
    print("\n2. Test d'authentification:")
    test_user = users.first()
    if test_user:
        print(f"Test avec l'utilisateur: {test_user.username}")
        
        # Générer un token JWT
        refresh = RefreshToken.for_user(test_user)
        access_token = str(refresh.access_token)
        print(f"Token généré: {access_token[:50]}...")
        
        # 3. Tester l'API directement
        print("\n3. Test de l'API biométrie:")
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get('http://localhost:8000/biometries/', headers=headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Données reçues: {json.dumps(data, indent=2)}")
            else:
                print(f"Erreur: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("Erreur: Impossible de se connecter au serveur. Assurez-vous que le serveur Django est démarré.")
        except Exception as e:
            print(f"Erreur lors de la requête: {e}")
    else:
        print("Aucun utilisateur patient trouvé")

if __name__ == '__main__':
    debug_biometrics()