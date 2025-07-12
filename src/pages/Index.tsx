
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AirportSearch from '@/components/AirportSearch';
import ChartDisplay from '@/components/ChartDisplay';
import { getAirportCharts } from '@/services/chartfoxApi';
import { GroupedChartsResponse } from '@/types/chartfox';

const Index = () => {
  const [chartsData, setChartsData] = useState<GroupedChartsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAirport, setCurrentAirport] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (icaoCode: string) => {
    setIsLoading(true);
    setError(null);
    setChartsData(null);
    setCurrentAirport(icaoCode);

    try {
      const data = await getAirportCharts(icaoCode);
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
