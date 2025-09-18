import api from "../../../services/api"

// Services pour la partie resume du dashboard patient
export const homeDashboardServices = {
    // Les informations du patient
    patientInfos: async () => {
        try {
            const response = await api.get('/patients/');
            const infosPatient = response.data
            return { infosPatient };
        } catch (err) {
            console.error('Erreur lors de la recuperation des informations patient : ', err);
            throw err;
        }
    },
    // Les rendez-vous du patient
    rendezVous: async () => {
        try {
            const response = await api.get('/rendez-vous');
            const datasRendezVous = response.data;
            return { datasRendezVous };
        } catch (err) {
            console.error('Erreur lors de la recuperation des donnees rendez-vous : ', err)
        }
    },
}