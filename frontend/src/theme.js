import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";


// Les differents couleurs du theme

export const tokens = (mode) => ({
    ...(mode === 'dark' 
    ? {
        primary: {  // Couleurs bleu pour le mode sombre
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
                        main: colors.secondary[500],
                    }, 
                    neutral: {
                        dark: colors.blackAccent[700],
                        main: colors.blackAccent[500],
                        light: colors.blackAccent[100],
                    },
                    background: {
                        default: colors.blackAccent[700],
                    },
                } 
                : {
                   primary: {
                        main: colors.primary[100],
                        light: '#f8f9fa',
                    },
                    secondary: {
                        main: colors.secondary[500],
                    }, 
                    neutral: {
                        dark: colors.blackAccent[700],
                        main: colors.blackAccent[500],
                        light: colors.blackAccent[100],
                    },
                    background: {
                        default: '#E4E4E480', // Couleur de fond pour le mode clair
                        
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
                ontFamily: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(","),
                fontSize: 14,
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
    const [ mode, setMode ] = useState("dark");

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