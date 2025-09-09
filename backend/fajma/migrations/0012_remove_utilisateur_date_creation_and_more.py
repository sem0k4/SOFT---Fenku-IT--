# Generated manually to fix duplicate column issue
# This migration replaces 0012_remove_utilisateur_date_creation_and_more.py

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('fajma', '0011_alter_utilisateur_options'),
    ]

    operations = [
        # Skip adding date_expiration_token since it already exists in the database
        # migrations.AddField(
        #     model_name='utilisateur',
        #     name='date_expiration_token',
        #     field=models.DateTimeField(blank=True, null=True),
        # ),
        migrations.AddField(
            model_name='utilisateur',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='Les groupes auxquels cet utilisateur appartient.', related_name='fajma_utilisateur_groups', to='auth.group', verbose_name='groupes'),
        ),
        # Skip adding token_confirmation_email since it already exists in the database
        # migrations.AddField(
        #     model_name='utilisateur',
        #     name='token_confirmation_email',
        #     field=models.CharField(blank=True, max_length=100, null=True),
        # ),
        migrations.AddField(
            model_name='utilisateur',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Permissions spécifiques pour cet utilisateur.', related_name='fajma_utilisateur_permissions', to='auth.permission', verbose_name='permissions utilisateur'),
        ),
    ]