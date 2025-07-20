import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";


// Creer les differents couleurs du theme

export const tokens = (mode) => ({
    ...(mode === 'dark' 
    ? {
        primary: {  // Couleurs bleu pour le mode sombre
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
                        main: colors.indigoAccent[500],
                    }, 
                    neutral: {
                        dark: colors.blackAccent[700],
                        main: colors.blackAccent[500],
                        light: colors.blackAccent[100],
                    },
                    background: {
                        default: colors.blackAccent[500],
                    },
                } 
                : {
                   primary: {
                        main: colors.primary[100],
                    },
                    secondary: {
                        main: colors.indigoAccent[500],
                    }, 
                    neutral: {
                        dark: colors.blackAccent[700],
                        main: colors.blackAccent[500],
                        light: colors.blackAccent[100],
                    },
                    background: {
                        default: "#fcfcfc", // Couleur de fond pour le mode clair

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