
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plane } from 'lucide-react';

interface AirportSearchProps {
  onSearch: (icaoCode: string) => void;
  isLoading: boolean;
}

const AirportSearch: React.FC<AirportSearchProps> = ({ onSearch, isLoading }) => {
  const [icaoCode, setIcaoCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (icaoCode.trim().length >= 3) {
      onSearch(icaoCode.trim().toUpperCase());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Recherche d'aéroport
        </CardTitle>
        <CardDescription>
          Entrez le code OACI de l'aéroport (ex: LFPG, KJFK, EGLL)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Code OACI (4 lettres)"
            value={icaoCode}
            onChange={(e) => setIcaoCode(e.target.value)}
            maxLength={4}
            className="uppercase"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={icaoCode.trim().length < 3 || isLoading}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Recherche...' : 'Rechercher les cartes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AirportSearch;
