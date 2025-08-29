#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de conversion du Guide d'Installation FAJMA en HTML
Auteur: FENKU-IT
Date: 2024
"""

import markdown
import os
from datetime import datetime

def convert_guide_to_html():
    """
    Convertit le guide d'installation Markdown en HTML avec style CSS intégré
    """
    
    # Chemins des fichiers
    input_file = "Guide_Installation_Outils_FAJMA.md"
    output_file = "Guide_Installation_Outils_FAJMA.html"
    
    # Vérifier que le fichier source existe
    if not os.path.exists(input_file):
        print(f"❌ Erreur: Le fichier {input_file} n'existe pas.")
        return False
    
    try:
        # Lire le contenu Markdown
        with open(input_file, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Convertir en HTML
        html_content = markdown.markdown(
            markdown_content,
            extensions=['codehilite', 'fenced_code', 'tables', 'toc']
        )
        
        # CSS intégré pour le style
        css_style = """
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            
            .header {
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px;
                margin-bottom: 30px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            
            .header h1 {
                margin: 0;
                font-size: 2.5em;
                font-weight: 300;
            }
            
            .header p {
                margin: 10px 0 0 0;
                font-size: 1.2em;
                opacity: 0.9;
            }
            
            .content {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            h1, h2, h3, h4, h5, h6 {
                color: #2c3e50;
                margin-top: 30px;
                margin-bottom: 15px;
            }
            
            h1 {
                border-bottom: 3px solid #3498db;
                padding-bottom: 10px;
            }
            
            h2 {
                border-bottom: 2px solid #e74c3c;
                padding-bottom: 8px;
                color: #e74c3c;
            }
            
            h3 {
                color: #f39c12;
                border-left: 4px solid #f39c12;
                padding-left: 15px;
            }
            
            h4 {
                color: #27ae60;
            }
            
            code {
                background-color: #f1f2f6;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                color: #e74c3c;
                font-size: 0.9em;
            }
            
            pre {
                background-color: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 20px 0;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
            }
            
            pre code {
                background: none;
                color: inherit;
                padding: 0;
            }
            
            .powershell {
                background-color: #012456;
                border-left: 4px solid #0078d4;
            }
            
            .bash {
                background-color: #2d3748;
                border-left: 4px solid #38a169;
            }
            
            .sql {
                background-color: #553c9a;
                border-left: 4px solid #9f7aea;
            }
            
            .json {
                background-color: #744210;
                border-left: 4px solid #ed8936;
            }
            
            blockquote {
                border-left: 4px solid #3498db;
                margin: 20px 0;
                padding: 15px 20px;
                background-color: #ebf3fd;
                border-radius: 0 8px 8px 0;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            
            th {
                background-color: #3498db;
                color: white;
                font-weight: 600;
            }
            
            tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            
            tr:hover {
                background-color: #e3f2fd;
            }
            
            .toc {
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            
            .toc h2 {
                margin-top: 0;
                color: #495057;
                border-bottom: 1px solid #dee2e6;
            }
            
            .toc ul {
                list-style-type: none;
                padding-left: 0;
            }
            
            .toc li {
                margin: 8px 0;
            }
            
            .toc a {
                color: #007bff;
                text-decoration: none;
                padding: 5px 10px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .toc a:hover {
                background-color: #e3f2fd;
                text-decoration: underline;
            }
            
            .alert {
                padding: 15px;
                margin: 20px 0;
                border-radius: 8px;
                border-left: 4px solid;
            }
            
            .alert-info {
                background-color: #d1ecf1;
                border-color: #17a2b8;
                color: #0c5460;
            }
            
            .alert-warning {
                background-color: #fff3cd;
                border-color: #ffc107;
                color: #856404;
            }
            
            .alert-success {
                background-color: #d4edda;
                border-color: #28a745;
                color: #155724;
            }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding: 20px;
                background-color: #6c757d;
                color: white;
                border-radius: 8px;
            }
            
            .command-block {
                position: relative;
                margin: 15px 0;
            }
            
            .command-block::before {
                content: attr(data-lang);
                position: absolute;
                top: -10px;
                right: 10px;
                background: #007bff;
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                font-weight: bold;
            }
            
            @media (max-width: 768px) {
                body {
                    padding: 10px;
                }
                
                .content {
                    padding: 20px;
                }
                
                .header h1 {
                    font-size: 2em;
                }
                
                pre {
                    padding: 15px;
                    font-size: 0.9em;
                }
            }
            
            .print-only {
                display: none;
            }
            
            @media print {
                body {
                    background: white;
                    color: black;
                }
                
                .header {
                    background: #333 !important;
                    -webkit-print-color-adjust: exact;
                }
                
                .print-only {
                    display: block;
                }
                
                .no-print {
                    display: none;
                }
                
                pre {
                    background: #f5f5f5 !important;
                    color: black !important;
                    border: 1px solid #ccc;
                }
            }
        </style>
        """
        
        # JavaScript pour l'interactivité
        javascript_code = """
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlocks = document.querySelectorAll('pre code');
            codeBlocks.forEach(block => {
                const parent = block.parentElement;
                const text = block.textContent.toLowerCase();
                
                if (text.includes('powershell') || text.includes('winget') || text.includes('choco')) {
                    parent.classList.add('powershell');
                    parent.setAttribute('data-lang', 'PowerShell');
                } else if (text.includes('sudo') || text.includes('apt') || text.includes('brew')) {
                    parent.classList.add('bash');
                    parent.setAttribute('data-lang', 'Bash');
                } else if (text.includes('create user') || text.includes('select')) {
                    parent.classList.add('sql');
                    parent.setAttribute('data-lang', 'SQL');
                } else if (text.includes('dependencies')) {
                    parent.classList.add('json');
                    parent.setAttribute('data-lang', 'JSON');
                }
                
                parent.classList.add('command-block');
            });
            
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });
        """
        
        # Template HTML complet
        html_template = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guide d'Installation des Outils FAJMA - FENKU-IT</title>
    <meta name="description" content="Guide complet d'installation des outils nécessaires pour le projet FAJMA de télémédecine">
    <meta name="author" content="FENKU-IT">
    <meta name="keywords" content="FAJMA, télémédecine, installation, Django, React, ESP32, IoT">
    {css_style}
</head>
<body>
    <div class="header">
        <h1>🛠️ Guide d'Installation des Outils FAJMA</h1>
        <p>Documentation technique complète - Projet de télémédecine avec communication temps réel</p>
        <p><strong>FENKU-IT</strong> | Version 1.0 | {datetime.now().strftime('%d/%m/%Y')}</p>
    </div>
    
    <div class="content">
        {html_content}
    </div>
    
    <div class="footer">
        <p><strong>FENKU-IT</strong> - Solutions Innovantes en Télémédecine</p>
        <p>Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}</p>
        <div class="print-only">
            <p>Version imprimée - Consultez la version numérique pour les liens interactifs</p>
        </div>
    </div>
    
    <script>
        {javascript_code}
    </script>
</body>
</html>
        """
        
        # Écrire le fichier HTML
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_template)
        
        print(f"✅ Conversion réussie!")
        print(f"📄 Fichier source: {input_file}")
        print(f"🌐 Fichier HTML généré: {output_file}")
        print(f"📊 Taille du fichier: {os.path.getsize(output_file)} bytes")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la conversion: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔄 Conversion du Guide d'Installation FAJMA en HTML...")
    print("=" * 60)
    
    success = convert_guide_to_html()
    
    if success:
        print("\n🎉 Conversion terminée avec succès!")
        print("💡 Vous pouvez maintenant ouvrir le fichier HTML dans votre navigateur.")
    else:
        print("\n💥 Échec de la conversion.")
        print("🔍 Vérifiez que le fichier Markdown existe et est accessible.")