
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Download, Calendar, MapPin } from 'lucide-react';
import { GroupedChartsResponse, Chart } from '@/types/chartfox';

interface ChartDisplayProps {
  data: GroupedChartsResponse;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ data }) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'current':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'superseded':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const openPdfUrl = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Airport Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {data.airport.ident} - {data.airport.name}
          </CardTitle>
          {data.airport.country_code && (
            <CardDescription>
              Pays: {data.airport.country_code}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {/* Charts by Category */}
      {data.chart_groups.map((group) => (
        <Card key={group.category}>
          <CardHeader>
            <CardTitle className="text-lg">
              {group.category}
              <Badge variant="secondary" className="ml-2">
                {group.charts.length} carte{group.charts.length > 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.charts.map((chart) => (
                <div key={chart.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-medium">{chart.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Du {formatDate(chart.effective_from)}</span>
                        {chart.effective_to && (
                          <span>au {formatDate(chart.effective_to)}</span>
                        )}
                      </div>
                    </div>
                    <Badge className={getStateColor(chart.state)}>
                      {chart.state}
                    </Badge>
                  </div>

                  {/* Chart Thumbnail */}
                  {chart.pdf_thumb_url && (
                    <div className="flex justify-center">
                      <img
                        src={chart.pdf_thumb_url}
                        alt={`Aperçu de ${chart.name}`}
                        className="max-w-xs border rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openPdfUrl(chart.pdf_day_url)}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {chart.pdf_day_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPdfUrl(chart.pdf_day_url)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Carte jour
                      </Button>
                    )}
                    {chart.pdf_night_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPdfUrl(chart.pdf_night_url)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Carte nuit
                      </Button>
                    )}
                  </div>

                  {group.charts.indexOf(chart) < group.charts.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {data.chart_groups.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Aucune carte trouvée pour cet aéroport.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartDisplay;
