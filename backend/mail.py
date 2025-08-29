<<<<<<< HEAD
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration SMTP (remplacez par vos informations réelles)
SMTP_HOST = 'mail.fenku-it.com'  # Remplacez par le serveur SMTP de LWS
SMTP_PORT = 587  # Port SMTP (vérifiez avec LWS)
SMTP_USER = 'efajma.contact@fenku-it.com'
SMTP_PASSWORD = 'cM6-bjYZEwKgxBW'  # Votre mot de passe email LWS
FROM_EMAIL = 'efajma.contact@fenku-it.com'  # Expéditeurs
TO_EMAIL = 'uteam880@gmail.com'  # Adresse email de test (remplacez par une adresse valide)

# Créer le message email
msg = MIMEMultipart()
msg['From'] = FROM_EMAIL
msg['To'] = TO_EMAIL
msg['Subject'] = 'Test Email from Django with LWS SMTP'

body = 'Ceci est un email de test envoyé depuis Django avec le serveur SMTP de LWS.'
msg.attach(MIMEText(body, 'plain'))

# Tester la connexion SMTP
try:
    # Initialiser la connexion
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()  # Activer TLS
    print("Connexion TLS établie.")

    # Se connecter avec les identifiants
    server.login(SMTP_USER, SMTP_PASSWORD)
    print("Authentification réussie.")

    # Envoyer l'email
    server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())
    print("Email envoyé avec succès à", TO_EMAIL)

except smtplib.SMTPAuthenticationError:
    print("Erreur : Nom d'utilisateur ou mot de passe incorrect. Vérifiez SMTP_USER et SMTP_PASSWORD.")
except smtplib.SMTPConnectError:
    print("Erreur : Impossible de se connecter au serveur SMTP. Vérifiez SMTP_HOST et SMTP_PORT.")
except smtplib.SMTPException as e:
    print(f"Erreur SMTP : {e}")
except Exception as e:
    print(f"Erreur inattendue : {e}")
finally:
    try:
        server.quit()
        print("Connexion SMTP fermée.")
    except:
=======
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration SMTP (remplacez par vos informations réelles)
SMTP_HOST = 'mail.fenku-it.com'  # Remplacez par le serveur SMTP de LWS
SMTP_PORT = 587  # Port SMTP (vérifiez avec LWS)
SMTP_USER = 'efajma.contact@fenku-it.com'
SMTP_PASSWORD = 'cM6-bjYZEwKgxBW'  # Votre mot de passe email LWS
FROM_EMAIL = 'efajma.contact@fenku-it.com'  # Expéditeurs
TO_EMAIL = 'uteam880@gmail.com'  # Adresse email de test (remplacez par une adresse valide)

# Créer le message email
msg = MIMEMultipart()
msg['From'] = FROM_EMAIL
msg['To'] = TO_EMAIL
msg['Subject'] = 'Test Email from Django with LWS SMTP'

body = 'Ceci est un email de test envoyé depuis Django avec le serveur SMTP de LWS.'
msg.attach(MIMEText(body, 'plain'))

# Tester la connexion SMTP
try:
    # Initialiser la connexion
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()  # Activer TLS
    print("Connexion TLS établie.")

    # Se connecter avec les identifiants
    server.login(SMTP_USER, SMTP_PASSWORD)
    print("Authentification réussie.")

    # Envoyer l'email
    server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())
    print("Email envoyé avec succès à", TO_EMAIL)

except smtplib.SMTPAuthenticationError:
    print("Erreur : Nom d'utilisateur ou mot de passe incorrect. Vérifiez SMTP_USER et SMTP_PASSWORD.")
except smtplib.SMTPConnectError:
    print("Erreur : Impossible de se connecter au serveur SMTP. Vérifiez SMTP_HOST et SMTP_PORT.")
except smtplib.SMTPException as e:
    print(f"Erreur SMTP : {e}")
except Exception as e:
    print(f"Erreur inattendue : {e}")
finally:
    try:
        server.quit()
        print("Connexion SMTP fermée.")
    except:
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
        pass