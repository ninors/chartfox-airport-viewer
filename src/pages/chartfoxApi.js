// chartfoxApi.js
const API_URL = 'https://api.chartfox.org/v1/charts/';
const TOKEN = 'CHARTFOX_TOKEN'; // remplace si besoin

export async function getAirportCharts(icaoCode) {
  const response = await fetch(`${API_URL}${icaoCode}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || 'Erreur lors du chargement des cartes.');
  }

  return await response.json();
}
