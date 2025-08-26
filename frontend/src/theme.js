import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";


<<<<<<< HEAD
<<<<<<< HEAD
// Les differents couleurs du theme
=======
// Creer les differents couleurs du theme
>>>>>>> 692b537 (debut conception dashboard patient)
=======
// Les differents couleurs du theme
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)

export const tokens = (mode) => ({
    ...(mode === 'dark' 
    ? {
        primary: {  // Couleurs bleu pour le mode sombre
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
            100: "#d2d5dc",
            200: "#a4abb9",
            300: "#778195",
            400: "#495772",
            500: "#1c2d4f",
            600: "#16243f",
            700: "#111b2f",
            800: "#0b1220",
            900: "#060910"
        },
        secondary: {
<<<<<<< HEAD
=======
>>>>>>> 692b537 (debut conception dashboard patient)
=======
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
            100: "#cceaef",
            200: "#99d5df",
            300: "#66c0d0",
            400: "#33abc0",
            500: "#0096b0",
            600: "#00788d",
            700: "#005a6a",
            800: "#003c46",
            900: "#001e23"
        },
<<<<<<< HEAD
<<<<<<< HEAD
=======
        indigoAccent: {
            100: "#d7d9dc",
            200: "#afb3b9",
            300: "#878d97",
            400: "#5f6774",
            500: "#374151",
            600: "#2c3441",
            700: "#212731",
            800: "#161a20",
            900: "#0b0d10"
        },
>>>>>>> 692b537 (debut conception dashboard patient)
=======
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
        blackAccent: {
            100: "#d4d6d7",
            200: "#a8adaf",
            300: "#7d8488",
            400: "#515b60",
            500: "#263238",
            600: "#1e282d",
            700: "#171e22",
            800: "#0f1416",
            900: "#080a0b"
        },
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
        redAccent: {
            100: "#ffebee",
            200: "#ffcdd2",
            300: "#ef9a9a",
            400: "#e57373",
            500: "#f44336",
            600: "#e53935",
            700: "#d32f2f",
            800: "#c62828",
            900: "#b71c1c"
        },
        greenAccent: {
            100: "#e8f5e8",
            200: "#c8e6c9",
            300: "#a5d6a7",
            400: "#81c784",
            500: "#66bb6a",
            600: "#4caf50",
            700: "#43a047",
            800: "#388e3c",
            900: "#2e7d32"
        },
        grey: {
            100: "#f5f5f5",
            200: "#eeeeee",
            300: "#e0e0e0",
            400: "#bdbdbd",
            500: "#9e9e9e",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121"
        },
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
    } 
    : {
        primary: { // Couleurs bleu pour le mode clair
            light: "#fcfcfc",
            main: "#0096b0",
            100: "#060910",
            200: "#0b1220",
            300: "#111b2f",
            400: "#16243f",
            500: "#1c2d4f",
            600: "#495772",
            700: "#778195",
            800: "#a4abb9",
            900: "#d2d5dc",
        },
        secondary: {
<<<<<<< HEAD
=======
    } 
    : {
        primary: { // Couleurs bleu pour le mode clair
>>>>>>> 692b537 (debut conception dashboard patient)
=======
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
            100: "#001e23",
            200: "#003c46",
            300: "#005a6a",
            400: "#00788d",
            500: "#0096b0",
            600: "#33abc0",
            700: "#66c0d0",
            800: "#99d5df",
            900: "#cceaef",
        },
<<<<<<< HEAD
<<<<<<< HEAD
=======
        indigoAccent: {
            100: "#0b0d10",
            200: "#161a20",
            300: "#212731",
            400: "#2c3441",
            500: "#374151",
            600: "#5f6774",
            700: "#878d97",
            800: "#afb3b9",
            900: "#d7d9dc",
        },
>>>>>>> 692b537 (debut conception dashboard patient)
=======
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
        blackAccent: {
            100: "#080a0b",
            200: "#0f1416",
            300: "#171e22",
            400: "#1e282d",
            500: "#263238",
            600: "#515b60",
            700: "#7d8488",
            800: "#a8adaf",
            900: "#d4d6d7",
        },
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
        redAccent: {
            100: "#b71c1c",
            200: "#c62828",
            300: "#d32f2f",
            400: "#e53935",
            500: "#f44336",
            600: "#e57373",
            700: "#ef9a9a",
            800: "#ffcdd2",
            900: "#ffebee"
        },
        greenAccent: {
            100: "#2e7d32",
            200: "#388e3c",
            300: "#43a047",
            400: "#4caf50",
            500: "#66bb6a",
            600: "#81c784",
            700: "#a5d6a7",
            800: "#c8e6c9",
            900: "#e8f5e8"
        },
        grey: {
            100: "#212121",
            200: "#424242",
            300: "#616161",
            400: "#757575",
            500: "#9e9e9e",
            600: "#bdbdbd",
            700: "#e0e0e0",
            800: "#eeeeee",
            900: "#f5f5f5"
        },
<<<<<<< HEAD
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======
>>>>>>> 692b537 (debut conception dashboard patient)
>>>>>>> fc99c8a (debut conception dashboard patient)
    })

    // Si le mode est 'dark', on utilise les couleurs sombres, 
    // sinon on utilise les couleurs claires en inversant l
    // es valeurs entre 100 et 900
})


// material ui theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        // Couleurs du thème
        palette: {
            mode: mode,
            ...(mode === 'dark'
                ? {
                    primary: {
                        main: colors.primary[500],
                    },
                    secondary: {
<<<<<<< HEAD
<<<<<<< HEAD
                        main: colors.secondary[500],
=======
                        main: colors.indigoAccent[500],
>>>>>>> 692b537 (debut conception dashboard patient)
=======
                        main: colors.secondary[500],
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
                    }, 
                    neutral: {
                        dark: colors.blackAccent[700],
                        main: colors.blackAccent[500],
                        light: colors.blackAccent[100],
                    },
                    background: {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                        default: colors.blackAccent[700],
=======
                        default: colors.blackAccent[500],
>>>>>>> 692b537 (debut conception dashboard patient)
=======
                        default: colors.primary[800],
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
=======
                        default: colors.blackAccent[700],
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
                    },
                } 
                : {
                   primary: {
                        main: colors.primary[100],
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                        light: '#f8f9fa',
                    },
                    secondary: {
                        main: colors.secondary[500],
=======
                    },
                    secondary: {
                        main: colors.indigoAccent[500],
>>>>>>> 692b537 (debut conception dashboard patient)
=======
                        light: '#fcfcfc',
=======
                        light: '#f8f9fa',
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
                    },
                    secondary: {
                        main: colors.secondary[500],
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
                    }, 
                    neutral: {
                        dark: colors.blackAccent[700],
                        main: colors.blackAccent[500],
                        light: colors.blackAccent[100],
                    },
                    background: {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                        default: '#E4E4E480', // Couleur de fond pour le mode clair
                        
=======
                        default: "#fcfcfc", // Couleur de fond pour le mode clair

>>>>>>> 692b537 (debut conception dashboard patient)
=======
                        default: colors.blackAccent[900], // Couleur de fond pour le mode clair
=======
                        default: '#E4E4E480', // Couleur de fond pour le mode clair
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
                        
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
                    },  
                } 
            )
        },
        // Typographie du thème
        typography: {
            fontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: 40,
            },
            h2: {
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: 32,
            },
            h3: {
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: 24,
            },
            h4: {
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: 20,
            },
            h5: {
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: 16,
            },
            h6: {
<<<<<<< HEAD
<<<<<<< HEAD
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
<<<<<<< HEAD
<<<<<<< HEAD
                fontSize: 14,
=======
=======
                fontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
=======
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
>>>>>>> 4df3e6e (Revert "ajout de l'icone du chatbot et quelque modif dans le dashboard patient")
            fontSize: 14,
>>>>>>> 692b537 (debut conception dashboard patient)
=======
                fontSize: 14,
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
            }
        
        }
    }
}

// Context for colors mode
export const ColorModeContext = createContext({
    toggleColorMode: () => {}
}) 

// Creer un hooks useMode
// useMemo est un Hook React qui vous permet de mettre en cache le résultat d’un calcul d’un rendu à l’autre.
//  https://fr.react.dev/reference/react/useMemo
export const useMode = () => {
<<<<<<< HEAD
<<<<<<< HEAD
    const [ mode, setMode ] = useState("light");
=======
    const [ mode, setMode ] = useState("dark");
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
    const [ mode, setMode ] = useState("light");
>>>>>>> fc740fa (accueil du dashboard patient en se referant sur le prototype figma)

    const colorMode = useMemo (
        () => ({
            toggleColorMode: () => 
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );
    // Créer le thème MUI avec les paramètres du thème
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return [ theme, colorMode]
}