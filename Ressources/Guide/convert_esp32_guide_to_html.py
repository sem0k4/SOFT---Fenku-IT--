#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import markdown
import os

def convert_esp32_guide_to_html():
    # Chemins des fichiers
    md_file = 'Guide_Communication_Directe_ESP32.md'
    html_file = 'Guide_Communication_Directe_ESP32.html'
    
    # Vérifier si le fichier Markdown existe
    if not os.path.exists(md_file):
        print(f"Erreur: Le fichier {md_file} n'existe pas.")
        return False
    
    try:
        # Lire le contenu Markdown
        with open(md_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Convertir en HTML
        html_content = markdown.markdown(
            md_content,
            extensions=['codehilite', 'toc', 'tables', 'fenced_code'],
            extension_configs={
                'codehilite': {
                    'css_class': 'highlight',
                    'use_pygments': True
                },
                'toc': {
                    'title': 'Table des Matières'
                }
            }
        )
        
        # CSS intégré pour le style
        css_styles = """
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
            
            .content {
                background: white;
                padding: 30px;
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
            
            .toc {
                background: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #3498db;
            }
            
            .toc ul {
                list-style-type: none;
                padding-left: 0;
            }
            
            .toc li {
                margin: 8px 0;
            }
            
            .toc a {
                color: #2980b9;
                text-decoration: none;
                font-weight: 500;
            }
            
            .toc a:hover {
                color: #3498db;
                text-decoration: underline;
            }
            
            pre {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 20px 0;
                border-left: 4px solid #e74c3c;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.4;
            }
            
            code {
                background: #ecf0f1;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                color: #e74c3c;
                font-size: 0.9em;
            }
            
            pre code {
                background: transparent;
                padding: 0;
                color: inherit;
            }
            
            blockquote {
                border-left: 4px solid #f39c12;
                margin: 20px 0;
                padding: 15px 20px;
                background: #fef9e7;
                font-style: italic;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            th, td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            
            th {
                background: #34495e;
                color: white;
                font-weight: 600;
            }
            
            tr:hover {
                background: #f8f9fa;
            }
            
            .highlight {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 20px 0;
            }
            
            .protocol-section {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #28a745;
            }
            
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #f39c12;
            }
            
            .info {
                background: #d1ecf1;
                border: 1px solid #bee5eb;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #17a2b8;
            }
            
            .footer {
                text-align: center;
                margin-top: 40px;
                padding: 20px;
                background: #34495e;
                color: white;
                border-radius: 8px;
            }
            
            @media (max-width: 768px) {
                body {
                    padding: 10px;
                }
                
                .header h1 {
                    font-size: 2em;
                }
                
                .content {
                    padding: 20px;
                }
                
                pre {
                    padding: 15px;
                    font-size: 12px;
                }
            }
            
            /* Syntax highlighting pour le code */
            .highlight .k { color: #66d9ef; } /* Keyword */
            .highlight .s { color: #a6e22e; } /* String */
            .highlight .c { color: #75715e; } /* Comment */
            .highlight .n { color: #f8f8f2; } /* Name */
            .highlight .o { color: #f92672; } /* Operator */
            .highlight .p { color: #f8f8f2; } /* Punctuation */
        </style>
        """
        
        # JavaScript pour la navigation
        js_script = """
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Smooth scrolling pour les liens internes
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
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
                
                // Bouton retour en haut
                const backToTop = document.createElement('button');
                backToTop.innerHTML = '↑';
                backToTop.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                    cursor: pointer;
                    display: none;
                    z-index: 1000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                `;
                
                backToTop.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                
                document.body.appendChild(backToTop);
                
                // Afficher/masquer le bouton selon le scroll
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        backToTop.style.display = 'block';
                    } else {
                        backToTop.style.display = 'none';
                    }
                });
            });
        </script>
        """
        
        # Template HTML complet
        full_html = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guide Communication Directe ESP32 - Projet FAJMA</title>
    {css_styles}
</head>
<body>
    <div class="header">
        <h1>📡 Guide Communication Directe ESP32</h1>
        <p>Projet FAJMA - Solutions IoT Temps Réel</p>
    </div>
    
    <div class="content">
        {html_content}
    </div>
    
    <div class="footer">
        <p>© 2024 FENKU-IT - Guide ESP32 Communication Directe</p>
        <p>Généré automatiquement le {os.path.basename(__file__)}</p>
    </div>
    
    {js_script}
</body>
</html>
        """
        
        # Écrire le fichier HTML
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(full_html)
        
        print(f"✅ Conversion réussie: {md_file} → {html_file}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la conversion: {str(e)}")
        return False

if __name__ == "__main__":
    convert_esp32_guide_to_html()