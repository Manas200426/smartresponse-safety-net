
export type AccidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface AccidentReport {
  id: string;
  location: Location;
  severity: AccidentSeverity;
  images: string[];
  description: string;
  timestamp: string;
  reporter: {
    id: string;
    role: string;
    contact?: string;
  };
  ai_verification?: {
    is_valid: boolean;
    confidence: number;
  };
  status: 'reported' | 'dispatched' | 'in_progress' | 'resolved';
  responders?: {
    police?: string[];
    ambulance?: string[];
  };
}

export interface LiveAlert extends AccidentReport {
  distance?: number; // Distance from user in km/miles
  eta?: number; // Estimated time of arrival in minutes
}
