#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import markdown
import os
from datetime import datetime

def convert_markdown_to_html():
    # Fichiers d'entrée et de sortie
    input_file = 'Guide_Affichage_Temps_Reel_Frontend.md'
    output_file = 'Guide_Affichage_Temps_Reel_Frontend.html'
    
    # Vérifier si le fichier Markdown existe
    if not os.path.exists(input_file):
        print(f"Erreur: Le fichier {input_file} n'existe pas.")
        return
    
    # Lire le contenu Markdown
    with open(input_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    # Convertir Markdown en HTML
    md = markdown.Markdown(extensions=['codehilite', 'toc', 'tables', 'fenced_code'])
    html_content = md.convert(markdown_content)
    
    # CSS intégré pour le style
    css_styles = """
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            margin-top: 20px;
            margin-bottom: 20px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        h2 {
            color: #34495e;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #3498db;
            font-size: 1.8em;
        }
        
        h3 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        
        h4 {
            color: #34495e;
            margin-top: 25px;
            margin-bottom: 10px;
            font-size: 1.2em;
        }
        
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        code {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            color: #e74c3c;
            font-size: 0.9em;
        }
        
        pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border-left: 4px solid #3498db;
        }
        
        pre code {
            background: none;
            color: inherit;
            padding: 0;
            font-size: 0.9em;
        }
        
        blockquote {
            background: #ecf0f1;
            border-left: 5px solid #3498db;
            margin: 20px 0;
            padding: 15px 20px;
            font-style: italic;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background: #3498db;
            color: white;
            font-weight: 600;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .toc {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        
        .toc li {
            margin: 8px 0;
        }
        
        .toc a {
            color: #3498db;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .toc a:hover {
            color: #2980b9;
            text-decoration: underline;
        }
        
        .highlight {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        
        .info-box {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #17a2b8;
        }
        
        .warning-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            transition: all 0.3s;
            opacity: 0;
            visibility: hidden;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .header-info {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 10px;
        }
        
        .generation-date {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 10px;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                padding: 15px;
                border-radius: 10px;
            }
            
            h1 {
                font-size: 2em;
            }
            
            h2 {
                font-size: 1.5em;
            }
            
            pre {
                padding: 15px;
                font-size: 0.8em;
            }
            
            table {
                font-size: 0.9em;
            }
            
            th, td {
                padding: 8px 10px;
            }
        }
        
        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .container {
            animation: fadeIn 0.6s ease-out;
        }
        
        /* Syntax highlighting pour les blocs de code */
        .codehilite {
            background: #2c3e50 !important;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            overflow-x: auto;
        }
        
        .codehilite pre {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
        }
    </style>
    """
    
    # JavaScript pour les fonctionnalités interactives
    javascript_code = """
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Bouton retour en haut
            const backToTopButton = document.createElement('button');
            backToTopButton.innerHTML = '↑';
            backToTopButton.className = 'back-to-top';
            backToTopButton.onclick = function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            document.body.appendChild(backToTopButton);
            
            // Afficher/masquer le bouton selon le scroll
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            });
            
            // Smooth scrolling pour les liens d'ancrage
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Ajouter des classes CSS aux éléments spéciaux
            document.querySelectorAll('blockquote').forEach(quote => {
                if (quote.textContent.includes('Note') || quote.textContent.includes('INFO')) {
                    quote.classList.add('info-box');
                } else if (quote.textContent.includes('Attention') || quote.textContent.includes('WARNING')) {
                    quote.classList.add('warning-box');
                }
            });
        });
    </script>
    """
    
    # Template HTML complet
    html_template = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guide d'Affichage des Données IoT en Temps Réel - Frontend React</title>
    {css_styles}
</head>
<body>
    <div class="container">
        <div class="header-info">
            <h1>Guide d'Affichage des Données IoT en Temps Réel</h1>
            <p><strong>Frontend React pour le Projet FAJMA</strong></p>
            <div class="generation-date">
                Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}
            </div>
        </div>
        
        {html_content}
    </div>
    
    {javascript_code}
</body>
</html>
    """
    
    # Écrire le fichier HTML
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    print(f"✅ Conversion réussie: {input_file} → {output_file}")
    print(f"📄 Fichier HTML généré: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    convert_markdown_to_html()