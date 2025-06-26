from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, MinValueValidator

# Validateur pour les numéros de téléphone (format international, ex. +221771234567)
phone_validator = RegexValidator(
    regex=r'^\+?[1-9]\d{1,14}$',
    message="Le numéro de téléphone doit être au format international (ex. +221771234567)."
)

# Validateur pour les e-mails
email_validator = RegexValidator(
    regex=r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$',
    message="L'e-mail n'est pas valide."
)

#Class TypesAntecedents
class TypesAntecedents(models.Model):
    type_id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=50)

    class Meta:
        db_table = 'types_antecedents'
        managed = False

    def __str__(self):
        return self.nom
#Class  Services
class Services(models.Model):
    service_id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)

    class Meta:
        db_table = 'services'
        managed = False

    def __str__(self):
        return self.nom


#Class Hopitale
class Hopital(models.Model):
    hopital_id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    rue = models.CharField(max_length=100)
    ville = models.CharField(max_length=100)
    code_postal = models.CharField(max_length=10, blank=True, null=True)
    telephone = models.CharField(max_length=15, validators=[phone_validator])
    email = models.EmailField(validators=[email_validator], db_collation='case_insensitive')
    capacite = models.IntegerField(validators=[MinValueValidator(0)])

    class Meta:
        db_table = 'hopital'
        managed = False
        indexes = [
            models.Index(fields=['nom'], name='idx_hopital_nom')
        ]

    def __str__(self):
        return self.nom
#Class HopitalServices
class HopitalServices(models.Model):
    hopital = models.ForeignKey(Hopital, on_delete=models.CASCADE)
    service = models.ForeignKey(Services, on_delete=models.CASCADE)

    class Meta:
        db_table = 'hopital_services'
        managed = False
        unique_together = ('hopital', 'service')

    def __str__(self):
        return f"{self.hopital.nom} - {self.service.nom}"

#Class Utilisateur
class Utilisateur(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('medecin', 'Médecin'),
        ('admin', 'Administrateur'),
    )
    user_id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    email_verifie = models.BooleanField(default=False)
    token_confirmation_email = models.CharField(max_length=100, blank=True, null=True)
    date_expiration_token = models.DateTimeField(null=True, blank=True)
    
    # Champs pour la réinitialisation de mot de passe
    reset_password_code = models.CharField(max_length=6, blank=True, null=True)
    reset_password_expiry = models.DateTimeField(null=True, blank=True)

    # Champs hérités de AbstractUser
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(validators=[email_validator], unique=True, db_collation='case_insensitive')

    # Ajout de related_name pour éviter les conflits
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='fajma_utilisateur_groups',
        blank=True,
        help_text="Les groupes auxquels cet utilisateur appartient.",
        verbose_name="groupes",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='fajma_utilisateur_permissions',
        blank=True,
        help_text="Permissions spécifiques pour cet utilisateur.",
        verbose_name="permissions utilisateur",
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'role']

    class Meta:
        db_table = 'utilisateur'
        managed = False

    def __str__(self):
        return self.username
    
#Class Medecin
class Medecin(models.Model):
    medecin_id = models.AutoField(primary_key=True)
    prenom = models.CharField(max_length=100)
    nom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=15, validators=[phone_validator])
    email = models.EmailField(validators=[email_validator], db_collation='case_insensitive')
    hopital = models.ForeignKey(Hopital, on_delete=models.RESTRICT)
    user = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True)
    specialite = models.CharField(max_length=50)

    class Meta:
        db_table = 'medecin'
        managed = False

    def __str__(self):
        return f"{self.prenom} {self.nom}"

#class Patient
class Patient(models.Model):
    SEXE_CHOICES = (
        ('M', 'Masculin'),
        ('F', 'Féminin'),
       
    )
    patient_id = models.AutoField(primary_key=True)
    prenom = models.CharField(max_length=100)
    nom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    sexe = models.CharField(max_length=10, choices=SEXE_CHOICES, blank=True, null=True)
    numero_identification_national = models.CharField(max_length=50, blank=True, null=True)
    rue = models.CharField(max_length=100)
    ville = models.CharField(max_length=100)
    code_postal = models.CharField(max_length=10, blank=True, null=True)
    telephone = models.CharField(max_length=15, validators=[phone_validator])
    email = models.EmailField(validators=[email_validator], db_collation='case_insensitive')
    user = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'patient'
        managed = False
        indexes = [
            models.Index(fields=['nom'], name='idx_patient_nom')
        ]

    def __str__(self):
        return f"{self.prenom} {self.nom}"


#Class Capteurs
class CapteurIoT(models.Model):
    STATUT_CHOICES = (
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('en panne', 'En panne'),
    )
    capteur_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    dateinstallation = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)

    class Meta:
        db_table = 'capteuriot'
        managed = False

    def __str__(self):
        return f"{self.type} ({self.patient})"
    

#Class Antecedents
class Consultation(models.Model):
    consultation_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    capteur = models.ForeignKey(CapteurIoT, on_delete=models.RESTRICT)
    valeur = models.DecimalField(max_digits=10, decimal_places=2)
    medecin = models.ForeignKey(Medecin, on_delete=models.RESTRICT)
    date_consultation = models.DateTimeField()
    session_video_id = models.CharField(max_length=100, blank=True, null=True)
    prescription = models.TextField(blank=True, null=True)
    diagnostic = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'consultation'
        managed = False
       
    def __str__(self):
        return f"Consultation {self.consultation_id} ({self.patient})"

#Class Ordonnance
class Ordonnance(models.Model):
    ordonnance_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medecin = models.ForeignKey(Medecin, on_delete=models.RESTRICT)
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE)
    Date_Ordonnance = models.DateField()
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'ordonnance'
        managed = False

    def __str__(self):
        return f"Ordonnance {self.ordonnance_id} ({self.patient})"

class Medicaments(models.Model):
    medicaments_id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)

    class Meta:
        db_table = 'medicaments'
        managed = False

    def __str__(self):
        return self.nom

class LigneOrdonnance(models.Model):
    ligne_id = models.AutoField(primary_key=True)
    ordonnance = models.ForeignKey(Ordonnance, on_delete=models.CASCADE)
    medicaments = models.ForeignKey(Medicaments, on_delete=models.RESTRICT)
    quantite = models.PositiveIntegerField()
    posologie = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'LigneOrdonnance'
        managed = False

    def __str__(self):
        return f"Ligne {self.ligne_id} ({self.ordonnance})"

class Analyses(models.Model):
    analyse_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    type_analyse = models.CharField(max_length=50)
    resultat = models.TextField()
    date = models.DateTimeField()

    class Meta:
        db_table = 'Analyses'
        managed = False
        indexes = [
            models.Index(fields=['date'], name='idx_analyses_date')
        ]

    def __str__(self):
        return f"Analyse {self.analyse_id} ({self.patient})"

class RadiographieEchographie(models.Model):
    TYPE_CHOICES = (
        ('radiographie', 'Radiographie'),
        ('echographie', 'Échographie'),
        ('autre', 'Autre'),
    )
    image_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    fichier_path = models.CharField(max_length=255)
    date = models.DateTimeField()

    class Meta:
        db_table = 'RadiographieEchographie'
        managed = False
        indexes = [
            models.Index(fields=['date'], name='idx_radiographie_date')
        ]

    def __str__(self):
        return f"Image {self.image_id} ({self.patient})"

class Antecedent(models.Model):
    Antecedent_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    Description = models.TextField()
    type = models.ForeignKey(TypesAntecedents, on_delete=models.RESTRICT)

    class Meta:
        db_table = 'Antecedent'
        managed = False

    def __str__(self):
        return f"Antécédent {self.Antecedent_id} ({self.patient})"

class Biometrie(models.Model):
    GROUPE_SANGUIN_CHOICES = (
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    )
    biometrie_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    GroupeSanguin = models.CharField(max_length=10, choices=GROUPE_SANGUIN_CHOICES)
    Poids = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    Taille = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        db_table = 'biometrie'
        managed = False

    def __str__(self):
        return f"Biométrie {self.biometrie_id} ({self.patient})"



class Allergie(models.Model):
    allergie_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    substance = models.CharField(max_length=100)
    severite = models.CharField(max_length=20)
    date_identification = models.DateField()

    class Meta:
        db_table = 'allergies'
        managed = False
        
class CarnetConsultation(models.Model):
    carnet_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    note = models.TextField()
    date = models.DateTimeField()

    class Meta:
        db_table = 'carnetconsultation'
        managed = False
        indexes = [
            models.Index(fields=['date'], name='idx_carnetconsultation_date')
        ]

    def __str__(self):
        return f"Carnet {self.carnet_id} ({self.patient})"

class Facture(models.Model):
    STATUT_PAIEMENT_CHOICES = (
        ('en_attente', 'En attente'),
        ('paye', 'Payé'),
        ('annule', 'Annulé'),
    )
    facture_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    montant = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    date_emission = models.DateField()
    description = models.TextField(blank=True, null=True)
    statut_paiement = models.CharField(max_length=20, choices=STATUT_PAIEMENT_CHOICES, default='en_attente')

    class Meta:
        db_table = 'facture'
        managed = False
        indexes = [
            models.Index(fields=['date_emission'], name='idx_facture_date_emission')
        ]

    def __str__(self):
        return f"Facture {self.facture_id} ({self.patient})"

class RendezVous(models.Model):
    STATUT_CHOICES = (
        ('planifie', 'Planifié'),
        ('annule', 'Annulé'),
        ('termine', 'Terminé'),
    )
    rdv_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medecin = models.ForeignKey(Medecin, on_delete=models.RESTRICT)
    date = models.DateTimeField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='planifie')

    class Meta:
        db_table = 'rendezvous'
        managed = False
        indexes = [
            models.Index(fields=['date'], name='idx_rendezvous_date')
        ]

    def __str__(self):
        return f"RDV {self.rdv_id} ({self.patient})"

class Logs(models.Model):
    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'logs'
        managed = False
        indexes = [
            models.Index(fields=['created_at'], name='idx_logs_created_at')
        ]

    def __str__(self):
        return f"Log {self.log_id} ({self.action})"

class Salle(models.Model):
    salle_id = models.AutoField(primary_key=True)
    hopital = models.ForeignKey(Hopital, on_delete=models.CASCADE)
    nom = models.CharField(max_length=100)

    class Meta:
        db_table = 'salle'
        managed = False

    def __str__(self):
        return f"{self.nom} ({self.hopital})"

class Lit(models.Model):
    lit_id = models.AutoField(primary_key=True)
    salle = models.ForeignKey(Salle, on_delete=models.CASCADE)
    numero = models.PositiveSmallIntegerField()

    class Meta:
        db_table = 'lit'
        managed = False

    def __str__(self):
        return f"Lit {self.numero} ({self.salle})"

class Hospitalisation(models.Model):
    hospitalisation_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    lit = models.ForeignKey(Lit, on_delete=models.RESTRICT)
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField(blank=True, null=True)
    motif = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'hospitalisation'
        managed = False

    def __str__(self):
        return f"Hospitalisation {self.hospitalisation_id} ({self.patient})"

class Ambulance(models.Model):
    ambulance_id = models.AutoField(primary_key=True)
    hopital = models.ForeignKey(Hopital, on_delete=models.CASCADE)
    immatriculation = models.CharField(max_length=20)

    class Meta:
        db_table = 'ambulance'
        managed = False

    def __str__(self):
        return f"Ambulance {self.immatriculation} ({self.hopital})"

class ServiceAccueil(models.Model):
    service_id = models.AutoField(primary_key=True)
    hopital = models.ForeignKey(Hopital, on_delete=models.CASCADE)
    nom = models.CharField(max_length=100)

    class Meta:
        db_table = 'serviceaccueil'
        managed = False

    def __str__(self):
        return f"{self.nom} ({self.hopital})"

class ConseilsSante(models.Model):
    conseil_id = models.AutoField(primary_key=True)
    contenu = models.TextField()
    auteur = models.ForeignKey(Utilisateur, on_delete=models.RESTRICT)
    date_publication = models.DateTimeField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = 'conseils_sante'
        managed = False
        indexes = [
            models.Index(fields=['date_publication'], name='idx_conseils_sante_date')
        ]

    def __str__(self):
        return f"Conseil {self.conseil_id} ({self.auteur})"


class HabitudesVie(models.Model):
    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    tabagisme = models.CharField(max_length=50, blank=True)  # ex. : "non-fumeur", "fumeur"
    alcool = models.CharField(max_length=50, blank=True)
    activite_physique = models.CharField(max_length=100, blank=True)
    alimentation = models.TextField(blank=True)

    class Meta:
        db_table = 'habitudes_vie'
        managed = False
    def __str__(self):
        return f"Habitudes de vie de {self.patient}"
    



class DeclarationsNaissance(models.Model):
    STATUT_CHOICES = (
        ('en_attente', 'En attente'),
        ('validee', 'Validée'),
        ('rejetee', 'Rejetée'),
    )
    declaration_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='naissance_patient')
    parent = models.ForeignKey(Patient, on_delete=models.RESTRICT, related_name='naissance_parent')
    date_declaration = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)

    class Meta:
        db_table = 'declarations_naissance'
        managed = False
        indexes = [
            models.Index(fields=['date_declaration'], name='idx_dec_naiss_date')
        ]

    def __str__(self):
        return f"Déclaration {self.declaration_id} ({self.patient})"

class DocumentsMedicaux(models.Model):
    TYPE_CHOICES = (
        ('certificat_medical', 'Certificat médical'),
        ('attestation_aptitude', 'Attestation d’aptitude'),
        ('autre', 'Autre'),
    )
    document_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    fichier_path = models.CharField(max_length=255)
    date_emission = models.DateField()

    class Meta:
        db_table = 'documents_medicaux'
        managed = False

    def __str__(self):
        return f"Document {self.document_id} ({self.patient})"