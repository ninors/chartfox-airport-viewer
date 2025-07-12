
// Types basés sur la documentation ChartFox API
export interface Chart {
  id: string;
  name: string;
  category: string;
  pdf_thumb_url?: string;
  pdf_day_url?: string;
  pdf_night_url?: string;
  state: 'current' | 'superseded' | 'cancelled';
  effective_from?: string;
  effective_to?: string;
}

export interface ChartGroup {
  category: string;
  charts: Chart[];
}

export interface Airport {
  ident: string;
  name: string;
  country_code?: string;
}

export interface GroupedChartsResponse {
  airport: Airport;
  chart_groups: ChartGroup[];
}

export interface ApiError {
  error: string;
  message: string;
}
