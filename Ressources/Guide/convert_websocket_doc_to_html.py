#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de conversion de la documentation WebSocket Django en HTML
Auteur: Assistant IA - Projet FAJMA
Date: 29 Août 2025
"""

import markdown
import os
from datetime import datetime

def convert_websocket_doc_to_html():
    """
    Convertit la documentation WebSocket Django de Markdown vers HTML
    avec un style moderne et des fonctionnalités interactives.
    """
    
    # Chemins des fichiers
    input_file = 'Documentation_Serveur_WebSocket_Django.md'
    output_file = 'Documentation_Serveur_WebSocket_Django.html'
    
    try:
        # Lecture du fichier Markdown
        with open(input_file, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Configuration des extensions Markdown
        extensions = [
            'markdown.extensions.codehilite',
            'markdown.extensions.toc',
            'markdown.extensions.tables',
            'markdown.extensions.fenced_code',
            'markdown.extensions.attr_list'
        ]
        
        # Conversion Markdown vers HTML
        md = markdown.Markdown(extensions=extensions)
        html_content = md.convert(markdown_content)
        
        # Template HTML avec CSS moderne
        html_template = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation Serveur WebSocket Django - FAJMA</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            margin-top: 20px;
            margin-bottom: 20px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }}
        
        h1 {{
            color: #2c3e50;
            border-bottom: 4px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-align: center;
        }}
        
        h2 {{
            color: #34495e;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-left: 20px;
            border-left: 5px solid #3498db;
            font-size: 1.8em;
        }}
        
        h3 {{
            color: #2980b9;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.4em;
        }}
        
        h4 {{
            color: #8e44ad;
            margin-top: 25px;
            margin-bottom: 10px;
            font-size: 1.2em;
        }}
        
        p {{
            margin-bottom: 15px;
            text-align: justify;
        }}
        
        ul, ol {{
            margin-left: 30px;
            margin-bottom: 15px;
        }}
        
        li {{
            margin-bottom: 8px;
        }}
        
        code {{
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #e74c3c;
            font-size: 0.9em;
        }}
        
        pre {{
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border-left: 5px solid #3498db;
        }}
        
        pre code {{
            background: none;
            color: #ecf0f1;
            padding: 0;
        }}
        
        .codehilite {{
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border-left: 5px solid #3498db;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        
        th, td {{
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        
        th {{
            background: #3498db;
            color: white;
            font-weight: bold;
        }}
        
        tr:hover {{
            background: #f5f5f5;
        }}
        
        .toc {{
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 5px solid #2ecc71;
        }}
        
        .toc ul {{
            list-style-type: none;
            margin-left: 0;
        }}
        
        .toc a {{
            color: #2980b9;
            text-decoration: none;
            padding: 5px 0;
            display: block;
            transition: color 0.3s;
        }}
        
        .toc a:hover {{
            color: #3498db;
            text-decoration: underline;
        }}
        
        .alert {{
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 5px solid;
        }}
        
        .alert-info {{
            background: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }}
        
        .alert-warning {{
            background: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }}
        
        .alert-success {{
            background: #d4edda;
            border-color: #28a745;
            color: #155724;
        }}
        
        .back-to-top {{
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
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.3s;
            opacity: 0;
            visibility: hidden;
        }}
        
        .back-to-top.show {{
            opacity: 1;
            visibility: visible;
        }}
        
        .back-to-top:hover {{
            background: #2980b9;
            transform: translateY(-2px);
        }}
        
        .header-info {{
            background: linear-gradient(135deg, #74b9ff, #0984e3);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }}
        
        .emoji {{
            font-size: 1.2em;
            margin-right: 8px;
        }}
        
        @media (max-width: 768px) {{
            .container {{
                margin: 10px;
                padding: 15px;
            }}
            
            h1 {{
                font-size: 2em;
            }}
            
            h2 {{
                font-size: 1.5em;
            }}
            
            pre, .codehilite {{
                padding: 15px;
                font-size: 0.9em;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header-info">
            <h1>🚀 Documentation Serveur WebSocket Django</h1>
            <p><strong>Projet FAJMA - Communication Temps Réel IoT</strong></p>
            <p>Généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}</p>
        </div>
        
        {html_content}
        
        <hr style="margin: 40px 0; border: none; height: 2px; background: linear-gradient(to right, #3498db, #2ecc71);">
        
        <div class="alert alert-success">
            <strong>✅ Documentation générée avec succès !</strong><br>
            Cette documentation détaille l'implémentation complète du serveur WebSocket Django pour le projet FAJMA.
            Pour toute question, consultez les sections de dépannage ou les logs du serveur.
        </div>
    </div>
    
    <button class="back-to-top" onclick="scrollToTop()" title="Retour en haut">
        ↑
    </button>
    
    <script>
        // Bouton retour en haut
        window.onscroll = function() {{
            const backToTop = document.querySelector('.back-to-top');
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {{
                backToTop.classList.add('show');
            }} else {{
                backToTop.classList.remove('show');
            }}
        }};
        
        function scrollToTop() {{
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }}
        
        // Smooth scrolling pour les liens d'ancrage
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {{
            anchor.addEventListener('click', function (e) {{
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {{
                    target.scrollIntoView({{
                        behavior: 'smooth',
                        block: 'start'
                    }});
                }}
            }});
        }});
        
        // Highlight du code
        document.querySelectorAll('pre code').forEach((block) => {{
            // Ajouter des numéros de ligne pour les blocs de code longs
            const lines = block.textContent.split('\n');
            if (lines.length > 5) {{
                block.style.counterReset = 'line';
                block.style.paddingLeft = '3em';
            }}
        }});
        
        console.log('📚 Documentation WebSocket Django chargée avec succès!');
        console.log('🔗 Serveur disponible sur: http://127.0.0.1:8000/');
    </script>
</body>
</html>
        """
        
        # Écriture du fichier HTML
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_template)
        
        print(f"✅ Conversion réussie !")
        print(f"📄 Fichier d'entrée: {input_file}")
        print(f"🌐 Fichier de sortie: {output_file}")
        print(f"📊 Taille du fichier HTML: {os.path.getsize(output_file)} bytes")
        print(f"🕒 Généré le: {datetime.now().strftime('%d/%m/%Y à %H:%M:%S')}")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ Erreur: Le fichier {input_file} n'a pas été trouvé.")
        return False
    except Exception as e:
        print(f"❌ Erreur lors de la conversion: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Démarrage de la conversion de la documentation WebSocket Django...")
    print("=" * 70)
    
    success = convert_websocket_doc_to_html()
    
    print("=" * 70)
    if success:
        print("🎉 Conversion terminée avec succès !")
        print("💡 Vous pouvez maintenant ouvrir le fichier HTML dans votre navigateur.")
    else:
        print("💥 Échec de la conversion. Vérifiez les erreurs ci-dessus.")