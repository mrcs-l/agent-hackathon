export interface Disaster {
  id: string;
  name: string;
  type: 'hurricane' | 'earthquake' | 'flood' | 'wildfire' | 'tornado';
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPopulation: number;
  dateTime: string;
  needs: Need[];
}

export interface Need {
  id: string;
  category: string;
  specificItem: string;
  quantityRequested: number;
  quantityMatched: number;
  priority: 'low' | 'medium' | 'high';
  source: string;
}

export interface OperationalCenter {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  inventoryStatus: 'ample' | 'moderate' | 'low' | 'critical';
  totalItems: number;
  totalCategories: number;
  inventoryValue: number;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  productType: string;
  specificItem: string;
  quantity: number;
  corporatePartner: string;
  expiryDate?: string;
  dateReceived: string;
  location: string;
  condition: 'new' | 'good' | 'fair';
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'loading' | 'in_transit' | 'delayed' | 'delivered' | 'exception';
  estimatedArrival: string;
  currentLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
  logisticsPartner: string;
  manifest: ManifestItem[];
  timeline: TimelineEvent[];
}

export interface ManifestItem {
  item: string;
  quantity: number;
  unit: string;
  corporateDonor: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  location?: string;
}

export interface Alert {
  id: string;
  type: 'urgent' | 'info';
  message: string;
  timestamp: string;
  relatedId?: string;
  relatedType?: 'disaster' | 'shipment' | 'inventory';
}

export interface Route {
  id: string;
  origin: {
    lat: number;
    lng: number;
    name: string;
  };
  destination: {
    lat: number;
    lng: number;
    name: string;
  };
  confirmed: boolean;
  resources: {
    type: string;
    quantity: number;
    unit: string;
  }[];
  estimatedDuration: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}