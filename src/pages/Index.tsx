
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApiKeySetup from '@/components/ApiKeySetup';
import AirportSearch from '@/components/AirportSearch';
import ChartDisplay from '@/components/ChartDisplay';
import { getAirportCharts } from '@/services/chartfoxApi';
import { GroupedChartsResponse } from '@/types/chartfox';

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [chartsData, setChartsData] = useState<GroupedChartsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAirport, setCurrentAirport] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('chartfox_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    setError(null);
    toast({
      title: "Clé API configurée",
      description: "Vous pouvez maintenant rechercher des cartes d'aéroport",
    });
  };

  const handleSearch = async (icaoCode: string) => {
    if (!apiKey) {
      setError('Clé API manquante');
      return;
    }

    setIsLoading(true);
    setError(null);
    setChartsData(null);
    setCurrentAirport(icaoCode);

    try {
      const data = await getAirportCharts(icaoCode, apiKey);
      setChartsData(data);
      toast({
        title: "Cartes chargées",
        description: `Cartes trouvées pour l'aéroport ${icaoCode}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setChartsData(null);
    setCurrentAirport(null);
    setError(null);
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ChartFox Browser
            </h1>
            <p className="text-gray-600">
              Consultez les cartes d'aéroport avec l'API ChartFox
            </p>
          </div>
          <ApiKeySetup onApiKeySet={handleApiKeySet} currentApiKey={apiKey} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ChartFox Browser
          </h1>
          <p className="text-gray-600">
            Consultez les cartes d'aéroport avec l'API ChartFox
          </p>
        </div>

        {/* API Key Management */}
        <div className="mb-6 flex justify-center">
          <ApiKeySetup onApiKeySet={handleApiKeySet} currentApiKey={apiKey} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 flex justify-center">
            <Alert className="max-w-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        {!chartsData ? (
          <div className="flex justify-center">
            <AirportSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nouvelle recherche
              </Button>
            </div>
            <ChartDisplay data={chartsData} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Données fournies par{' '}
            <a
              href="https://chartfox.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ChartFox
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
