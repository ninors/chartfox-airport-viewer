
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey: string | null;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!currentApiKey);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('chartfox_api_key', apiKey.trim());
      onApiKeySet(apiKey.trim());
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuration API ChartFox
        </CardTitle>
        <CardDescription>
          Entrez votre clé API ChartFox pour accéder aux cartes d'aéroport
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Votre clé API est stockée localement dans votre navigateur pour des raisons de sécurité.
          </AlertDescription>
        </Alert>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="Entrez votre clé API ChartFox"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!apiKey.trim()} className="flex-1">
                Sauvegarder
              </Button>
              {currentApiKey && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Clé API configurée ✓
            </div>
            <Button variant="outline" onClick={handleEdit} className="w-full">
              Modifier la clé API
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
