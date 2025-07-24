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
  status?: 'active' | 'awaiting_resolution' | 'resolved';
  recommendations?: AlertRecommendation[];
}

export interface AlertRecommendation {
  id: string;
  title: string;
  description: string;
  costImpact?: string;
  timeImpact?: string;
  actions: AlertAction[];
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'approve' | 'view_route' | 'contact' | 'report_issue';
  primary?: boolean;
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
  alternativeRoutes?: AlternativeRoute[];
}

export interface AlternativeRoute {
  id: string;
  description: string;
  costImpact: string;
  timeImpact: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RealTimeUpdate {
  id: string;
  type: 'disaster' | 'shipment' | 'inventory' | 'matching';
  entityId: string;
  update: any;
  timestamp: string;
}

export interface ImpactMetrics {
  peopleHelped: number;
  wastePrevented: number;
  costSaved: number;
  disastersResponded: number;
}

export interface NotificationPopup {
  id: string;
  title: string;
  message: string;
  type: 'agentforce' | 'alert' | 'recommendation';
  actions?: AlertAction[];
  autoClose?: boolean;
}