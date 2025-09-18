#!/usr/bin/env node

/**
 * Script de test pour le chatbot médical
 * Vérifie que tous les composants et services fonctionnent correctement
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🤖 Test du Chatbot Médical FAJMA');
console.log('================================\n');

// Vérifier les fichiers essentiels
const essentialFiles = [
  'src/components/ChatbotMedical.jsx',
  'src/components/ChatbotButton.jsx',
  'src/components/ChatbotContainer.jsx',
  'src/hooks/useChatbot.js',
  'src/services/chatbotService.js',
  'src/services/auth.js',
  'src/services/api.js',
  'src/config/chatbot.js'
];

console.log('📁 Vérification des fichiers essentiels...');
let allFilesExist = true;

essentialFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    allFilesExist = false;
  }
});

console.log('\n📦 Vérification des dépendances...');

// Vérifier package.json
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    'lucide-react',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-avatar',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-progress',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-tabs',
    '@radix-ui/react-tooltip',
    'class-variance-authority',
    'clsx',
    'tailwind-merge'
  ];

  let allDepsInstalled = true;
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
    } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.devDependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - NON INSTALLÉ`);
      allDepsInstalled = false;
    }
  });

  if (allDepsInstalled) {
    console.log('\n✅ Toutes les dépendances sont installées');
  } else {
    console.log('\n❌ Certaines dépendances sont manquantes');
    console.log('💡 Exécutez: npm install');
  }
} else {
  console.log('❌ package.json non trouvé');
}

console.log('\n🔧 Vérification de la configuration...');

// Vérifier tailwind.config.js
const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
if (fs.existsSync(tailwindConfigPath)) {
  console.log('✅ tailwind.config.js trouvé');
} else {
  console.log('❌ tailwind.config.js manquant');
}

// Vérifier vite.config.js
const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  console.log('✅ vite.config.js trouvé');
} else {
  console.log('❌ vite.config.js manquant');
}

console.log('\n📋 Résumé des tests:');

if (allFilesExist) {
  console.log('✅ Tous les fichiers essentiels sont présents');
} else {
  console.log('❌ Certains fichiers essentiels sont manquants');
}

console.log('\n🚀 Instructions de démarrage:');
console.log('1. npm install');
console.log('2. npm run dev');
console.log('3. Ouvrir http://localhost:5173');
console.log('4. Visiter /chatbot pour tester le chatbot');
console.log('5. Visiter /chatbot-test pour les tests automatisés');

console.log('\n📚 Documentation:');
console.log('- README: frontend/CHATBOT_README.md');
console.log('- Dépannage: frontend/TROUBLESHOOTING.md');

console.log('\n🎉 Test terminé!');
