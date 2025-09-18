import { useEffect, useState } from "react";
import { homeDashboardServices } from ".";


const dataPatient = () => {

    const [ datasPatient, setDatasPatient ] = useState({});

    const getDatasPatient = async () => {
        try {
            const { infosPatient } = await homeDashboardServices.patientInfos();
            const data = infosPatient.results[0];
            setDatasPatient(data);
            
        } catch(err) {
            console.log('Erreur lors de la recuperation des informations patient : ', err);
        }
    }
    useEffect(() => {
        getDatasPatient();
    }, [])
    
    // Verifier si les donnees patients sont recuperer
    const getDatasSuccess = Object.keys(datasPatient).length !== 0;

    return { datasPatient, getDatasSuccess };
}

export default dataPatient;