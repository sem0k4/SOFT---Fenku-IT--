/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adaptez selon votre structure de fichiers
  ],
  theme: {
<<<<<<< HEAD
<<<<<<< HEAD
    extend: {},
=======
    extend: {
      colors: {
        // Votre palette personnalisée
        bleuSombre: '#1c2d4f',
        bleuClair: '#0096b0',
        blanc: '#ffffff',
        
        // Palette étendue recommandée
        primary: {
          dark: '#1c2d4f',   // bleuSombre
          DEFAULT: '#0096b0', // bleuClair
          light: '#e6f4f7',   // dérivé léger
        },
        secondary: {
          dark: '#0d3b66',    // bleu plus profond
          DEFAULT: '#3a86ff', // bleu vif complémentaire
          light: '#ebf2ff',
        },
        neutrali: {
          900: '#121212',
          800: '#1e1e1e',
          700: '#2d2d2d',
          600: '#4a4a4a',
          500: '#6b6b6b',
          400: '#9e9e9e',
          300: '#d1d1d1',
          200: '#e5e5e5',
          100: '#f5f5f5',
          50: '#fafafa',
          white: '#ffffff',
        },
        // Couleurs d'état
        success: {
          DEFAULT: '#4caf50',
          light: '#e8f5e9',
        },
        warning: {
          DEFAULT: '#ff9800',
          light: '#fff3e0',
        },
        error: {
          DEFAULT: '#f44336',
          light: '#ffebee',
        },
      },
      // Vous pouvez aussi étendre d'autres propriétés comme les polices, espacements etc.
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Exemple avec Inter    
      },
    },
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
=======
    extend: {},
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
  },
  plugins: [],
<<<<<<< HEAD
<<<<<<< HEAD
}

// #0096b0
=======
}
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
}

// #0096b0
>>>>>>> fc740fa (accueil du dashboard patient en se referant sur le prototype figma)
