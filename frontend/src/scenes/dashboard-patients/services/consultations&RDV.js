import { useState, useEffect } from "react"
import { homeDashboardServices } from "."
import { compareDesc } from "date-fns";


export const getAllRendezVous = () => {
    const [ allRendezVous, setAllRendezVous ] = useState([]);

    const getRendezVous = async () => {
        try {
            const { datasRendezVous } = await homeDashboardServices.rendezVous();
            const data = datasRendezVous.results;
            setAllRendezVous(data);
        } catch (err) {
            console.log('Erreur lors de la recuperation des donnees rendez-vous : ', err); 
        }
    };

    useEffect(() => {
        getRendezVous();
    }, []);

    return { allRendezVous };
}