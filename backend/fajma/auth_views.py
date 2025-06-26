from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UtilisateurSerializer
from django.core.mail import send_mail
from django.conf import settings
from .models import Utilisateur
import secrets
import random
from datetime import datetime, timedelta
from django.urls import reverse

class RegisterView(APIView):
    permission_classes = [AllowAny]  # Ajoutez cette ligne
    def post(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Générer le token de confirmation
            token = secrets.token_urlsafe(32)
            user.token_confirmation_email = token
            user.date_expiration_token = datetime.now() + timedelta(days=1)
            user.save()
            
            # Construire le lien de confirmation
            confirmation_url = request.build_absolute_uri(
                f'/auth/confirm-email/{token}/'
            )
            
            # Préparer le contenu HTML de l'email avec le logo intégré
            import base64
            import os
            
            # Lire et encoder le logo en base64
            logo_path = os.path.join(settings.BASE_DIR, 'static', 'Logo_A.png')
            with open(logo_path, 'rb') as f:
                logo_data = f.read()
                logo_base64 = base64.b64encode(logo_data).decode()
            
            # Créer le contenu HTML
            html_content = f'''
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .logo {{ max-width: 200px; margin-bottom: 20px; }}
                    .button {{ background-color: #2196F3; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px; display: inline-block; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="data:image/png;base64,{logo_base64}" class="logo" alt="FAJMA Logo">
                    <h2>Bonjour {user.first_name},</h2>
                    <p>Merci de vous être inscrit sur FAJMA. Pour activer votre compte, 
                    veuillez cliquer sur le bouton ci-dessous :</p>
                    <p><a href="{confirmation_url}" class="button">Confirmer mon compte</a></p>
                    <p>Ou copiez ce lien dans votre navigateur :<br>{confirmation_url}</p>
                    <p>Ce lien expire dans 24 heures.</p>
                    <p>Si vous n'avez pas créé de compte sur FAJMA, ignorez cet email.</p>
                    <p>Cordialement,<br>L'équipe FAJMA</p>
                </div>
            </body>
            </html>
            '''
            
            # Créer et envoyer l'email avec version texte et HTML
            from django.core.mail import EmailMultiAlternatives
            from django.utils.html import strip_tags
            
            text_content = strip_tags(html_content)
            msg = EmailMultiAlternatives(
                'Confirmation de votre compte FAJMA',
                text_content,
                settings.EMAIL_HOST_USER,
                [user.email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            
            return Response({
                'message': 'Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.',
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        print("Données reçues:", request.data)  # Ajoutez ce log
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Veuillez fournir un nom d\'utilisateur et un mot de passe'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:  # Ajoutez ce bloc try/except
            user = authenticate(username=username, password=password)
            
            if user:
                if not user.email_verifie:
                    return Response({
                        'error': 'Veuillez confirmer votre email avant de vous connecter.'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UtilisateurSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            
            return Response({
                'error': 'Identifiants invalides'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print("Erreur d'authentification:", str(e))  # Log l'erreur
            return Response({
                'error': 'Une erreur est survenue lors de l\'authentification'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UtilisateurSerializer(request.user)
        return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                # Invalider le token de rafraîchissement
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"message": "Déconnexion réussie"}, status=status.HTTP_205_RESET_CONTENT)
            else:
                return Response({"error": "Token de rafraîchissement non fourni"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        from django.http import HttpResponseRedirect
        
        try:
            user = Utilisateur.objects.get(
                token_confirmation_email=token,
                email_verifie=False,
                date_expiration_token__gt=datetime.now()
            )
            
            # Marquer l'email comme vérifié
            user.email_verifie = True
            user.token_confirmation_email = None
            user.date_expiration_token = None
            user.save()
            
            # Rediriger directement vers la page de connexion avec un paramètre de succès
            redirect_url = "http://localhost:5173/login?email_verified=true"
            return HttpResponseRedirect(redirect_url)
            
        except Utilisateur.DoesNotExist:
            # Rediriger directement vers la page de connexion avec un paramètre d'erreur
            redirect_url = "http://localhost:5173/login?email_verified=false"
            return HttpResponseRedirect(redirect_url)
        except Exception as e:
            # Rediriger directement vers la page de connexion avec un paramètre d'erreur
            redirect_url = "http://localhost:5173/login?email_verified=false"
            return HttpResponseRedirect(redirect_url)

# Classe pour la réinitialisation du mot de passe - Demande
class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'error': 'Veuillez fournir une adresse email'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Utilisateur.objects.get(email=email)
            
            # Générer un code de réinitialisation à 6 chiffres
            reset_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            
            # Enregistrer le code et sa date d'expiration
            user.reset_password_code = reset_code
            user.reset_password_expiry = datetime.now() + timedelta(minutes=15)
            user.save()
            
            # Préparer le contenu HTML de l'email
            html_content = f'''
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .code {{ font-size: 24px; font-weight: bold; color: #2196F3; letter-spacing: 5px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Réinitialisation de votre mot de passe</h2>
                    <p>Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de vérification :</p>
                    <p class="code">{reset_code}</p>
                    <p>Ce code est valable pendant 15 minutes.</p>
                    <p>Si vous n'avez pas demandé à réinitialiser votre mot de passe, ignorez cet email.</p>
                    <p>Cordialement,<br>L'équipe FAJMA</p>
                </div>
            </body>
            </html>
            '''
            
            # Créer et envoyer l'email
            from django.core.mail import EmailMultiAlternatives
            from django.utils.html import strip_tags
            
            text_content = strip_tags(html_content)
            msg = EmailMultiAlternatives(
                'Code de réinitialisation de mot de passe FAJMA',
                text_content,
                settings.EMAIL_HOST_USER,
                [email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            
            return Response({
                'message': 'Un code de réinitialisation a été envoyé à votre adresse email.'
            }, status=status.HTTP_200_OK)
            
        except Utilisateur.DoesNotExist:
            # Pour des raisons de sécurité, ne pas révéler que l'email n'existe pas
            return Response({
                'message': 'Si cette adresse email est associée à un compte, un code de réinitialisation a été envoyé.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Classe pour vérifier le code de réinitialisation
class VerifyResetCodeView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        
        if not email or not code:
            return Response({
                'error': 'Veuillez fournir une adresse email et un code de réinitialisation'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Utilisateur.objects.get(
                email=email,
                reset_password_code=code,
                reset_password_expiry__gt=datetime.now()
            )
            
            return Response({
                'message': 'Code de réinitialisation valide.'
            }, status=status.HTTP_200_OK)
            
        except Utilisateur.DoesNotExist:
            return Response({
                'error': 'Code de réinitialisation invalide ou expiré.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Classe pour définir un nouveau mot de passe
class SetNewPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        password = request.data.get('password')
        
        if not email or not code or not password:
            return Response({
                'error': 'Veuillez fournir tous les champs requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Utilisateur.objects.get(
                email=email,
                reset_password_code=code,
                reset_password_expiry__gt=datetime.now()
            )
            
            # Définir le nouveau mot de passe
            user.set_password(password)
            
            # Réinitialiser les champs de réinitialisation
            user.reset_password_code = None
            user.reset_password_expiry = None
            user.save()
            
            return Response({
                'message': 'Votre mot de passe a été réinitialisé avec succès.'
            }, status=status.HTTP_200_OK)
            
        except Utilisateur.DoesNotExist:
            return Response({
                'error': 'Code de réinitialisation invalide ou expiré.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Classe pour renvoyer l'email de confirmation
class ResendConfirmationEmailView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                'error': 'Veuillez fournir une adresse email'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Utilisateur.objects.get(email=email, email_verifie=False)
            
            # Générer un nouveau token de confirmation
            token = secrets.token_urlsafe(32)
            user.token_confirmation_email = token
            user.date_expiration_token = datetime.now() + timedelta(days=1)
            user.save()
            
            # Construire le lien de confirmation
            confirmation_url = request.build_absolute_uri(
                f'/auth/confirm-email/{token}/'
            )
            
            # Préparer le contenu HTML de l'email
            html_content = f'''
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .button {{ background-color: #2196F3; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px; display: inline-block; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Confirmation de votre compte FAJMA</h2>
                    <p>Voici un nouveau lien pour confirmer votre compte. Veuillez cliquer sur le bouton ci-dessous :</p>
                    <p><a href="{confirmation_url}" class="button">Confirmer mon compte</a></p>
                    <p>Ou copiez ce lien dans votre navigateur :<br>{confirmation_url}</p>
                    <p>Ce lien expire dans 24 heures.</p>
                    <p>Cordialement,<br>L'équipe FAJMA</p>
                </div>
            </body>
            </html>
            '''
            
            # Créer et envoyer l'email
            from django.core.mail import EmailMultiAlternatives
            from django.utils.html import strip_tags
            
            text_content = strip_tags(html_content)
            msg = EmailMultiAlternatives(
                'Confirmation de votre compte FAJMA',
                text_content,
                settings.EMAIL_HOST_USER,
                [email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            
            return Response({
                'message': 'Un nouvel email de confirmation a été envoyé.'
            }, status=status.HTTP_200_OK)
            
        except Utilisateur.DoesNotExist:
            return Response({
                'error': 'Adresse email non trouvée ou compte déjà confirmé.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
