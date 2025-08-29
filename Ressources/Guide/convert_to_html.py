#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import markdown
import os
from pathlib import Path

def convert_md_to_html():
    """Convertit le fichier Markdown en HTML avec style CSS intégré"""
    
    # Chemins des fichiers
    md_file = "Propositions_Integration_Communication_Temps_Reel_ESP32_FAJMA.md"
    html_file = "Propositions_Integration_Communication_Temps_Reel_ESP32_FAJMA.html"
    
    # Vérifier que le fichier Markdown existe
    if not os.path.exists(md_file):
        print(f"Erreur: Le fichier {md_file} n'existe pas.")
        return False
    
    # Lire le contenu Markdown
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Configuration Markdown avec extensions
    md = markdown.Markdown(extensions=[
        'markdown.extensions.tables',
        'markdown.extensions.fenced_code',
        'markdown.extensions.toc',
        'markdown.extensions.codehilite'
    ])
    
    # Convertir en HTML
    html_body = md.convert(md_content)
    
    # CSS pour le style professionnel
    css_style = """
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h1 { font-size: 2.5em; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { font-size: 2em; border-bottom: 2px solid #e74c3c; padding-bottom: 8px; }
        h3 { font-size: 1.5em; color: #e67e22; }
        h4 { font-size: 1.3em; color: #9b59b6; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: white;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #3498db;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #e8f4f8;
        }
        
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #e74c3c;
        }
        pre {
            background-color: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
        }
        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #ecf0f1;
            font-style: italic;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 8px 0;
        }
        
        .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        
        .success {
            background-color: #d4edda;
            padding: 15px;
            border-left: 4px solid #28a745;
            margin: 20px 0;
        }
        
        .warning {
            background-color: #f8d7da;
            padding: 15px;
            border-left: 4px solid #dc3545;
            margin: 20px 0;
        }
        
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
        }
        
        @media print {
            body { background-color: white; }
            .container { box-shadow: none; }
        }
    </style>
    """
    
    # HTML complet
    html_content = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Propositions d'Intégration Communication Temps Réel et ESP32 - Projet FAJMA</title>
    {css_style}
</head>
<body>
    <div class="container">
        {html_body}
    </div>
</body>
</html>
    """
    
    # Écrire le fichier HTML
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ Conversion réussie: {md_file} → {html_file}")
    print(f"📄 Fichier HTML généré: {os.path.abspath(html_file)}")
    
    return True

if __name__ == "__main__":
    print("🔄 Conversion Markdown vers HTML...")
    success = convert_md_to_html()
    
    if success:
        print("\n✨ Conversion terminée avec succès!")
        print("💡 Vous pouvez maintenant ouvrir le fichier HTML dans votre navigateur.")
    else:
        print("\n❌ Erreur lors de la conversion.")