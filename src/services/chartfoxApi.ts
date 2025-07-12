
import { GroupedChartsResponse, ApiError } from '@/types/chartfox';
import { CHARTFOX_API_KEY, CHARTFOX_BASE_URL } from '@/config/api';

class ChartFoxApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ChartFoxApiError';
  }
}

export const getAirportCharts = async (airportIdent: string): Promise<GroupedChartsResponse> => {
  try {
    console.log(`Recherche des cartes pour l'aéroport: ${airportIdent}`);
    
    if (CHARTFOX_API_KEY === 'YOUR_API_KEY_HERE') {
      throw new ChartFoxApiError('Clé API non configurée. Veuillez modifier le fichier src/config/api.ts');
    }
    
    const response = await fetch(
      `${CHARTFOX_BASE_URL}/airports/${airportIdent.toUpperCase()}/charts/grouped`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CHARTFOX_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'ChartFox-Airport-Charts-App/1.0'
        }
      }
    );

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Unknown error',
        message: `HTTP ${response.status}: ${response.statusText}`
      }));
      
      throw new ChartFoxApiError(
        errorData.message || `Erreur API: ${response.status}`,
        response.status
      );
    }

    const data: GroupedChartsResponse = await response.json();
    console.log(`Cartes trouvées pour ${airportIdent}:`, data);
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    
    if (error instanceof ChartFoxApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ChartFoxApiError('Erreur de connexion à l\'API ChartFox');
    }
    
    throw new ChartFoxApiError('Erreur inconnue lors de la récupération des cartes');
  }
};
