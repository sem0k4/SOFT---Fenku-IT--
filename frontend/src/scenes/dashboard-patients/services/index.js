import api from "../../../services/api"

// Services pour la partie resume du dashboard patient
export const homeDashboard = {
    // Recuperer les 3 derniers consultations
    getConsultations: () => {
        return api.get()
    }
}