import { Disaster, Alert, Route, OperationalCenter } from '../types';

export const typhoonGenesisDisaster: Disaster = {
  id: 'typhoon-genesis',
  name: 'Typhoon Genesis',
  type: 'hurricane',
  severity: 'critical',
  location: {
    lat: 14.5995,
    lng: 120.9842,
    name: 'Manila, Philippines'
  },
  affectedPopulation: 2300000,
  dateTime: new Date().toISOString(),
  needs: [
    {
      id: 'typhoon-need-1',
      category: 'Emergency Shelter',
      specificItem: 'Emergency Tents',
      quantityRequested: 600000,
      quantityMatched: 0,
      priority: 'high',
      source: 'Philippine Red Cross'
    },
    {
      id: 'typhoon-need-2',
      category: 'Medical',
      specificItem: 'Medical Emergency Kits',
      quantityRequested: 180000,
      quantityMatched: 0,
      priority: 'high',
      source: 'WHO Philippines'
    },
    {
      id: 'typhoon-need-3',
      category: 'Food',
      specificItem: 'Emergency Food Rations',
      quantityRequested: 1500000,
      quantityMatched: 0,
      priority: 'high',
      source: 'WFP Philippines'
    },
    {
      id: 'typhoon-need-4',
      category: 'Water',
      specificItem: 'Water Purification Systems',
      quantityRequested: 25000,
      quantityMatched: 0,
      priority: 'high',
      source: 'UNICEF Philippines'
    },
    {
      id: 'typhoon-need-5',
      category: 'Search and Rescue',
      specificItem: 'Search Equipment',
      quantityRequested: 1500,
      quantityMatched: 0,
      priority: 'high',
      source: 'NDRRMC Philippines'
    }
  ]
};

export const typhoonGenesisAlert: Alert = {
  id: 'typhoon-genesis-alert',
  type: 'urgent',
  message: '🌪️ URGENT: Typhoon Genesis approaching Philippines - New disaster zone detected',
  timestamp: new Date().toISOString(),
  relatedId: 'typhoon-genesis',
  relatedType: 'disaster',
  status: 'active',
  recommendations: [
    {
      id: 'typhoon-rec-1',
      title: 'Pre-position Emergency Resources',
      description: 'Agentforce recommends pre-positioning emergency supplies from Singapore and Tokyo hubs. Estimated 2.3M people in potential impact zone. Deploy within 12 hours for optimal coverage.',
      costImpact: '+$45,000',
      timeImpact: '12 hours prep time',
      actions: [
        { id: 'typhoon-act-1', label: 'Approve Pre-positioning', type: 'approve', primary: true },
        { id: 'typhoon-act-2', label: 'View Deployment Routes', type: 'view_route' },
        { id: 'typhoon-act-3', label: 'Contact Regional Hubs', type: 'contact' }
      ]
    }
  ]
};

export const typhoonPrepositioningRoutes: Route[] = [
  {
    id: 'typhoon-route-singapore',
    origin: {
      lat: 1.3521,
      lng: 103.8198,
      name: 'Singapore Hub'
    },
    destination: {
      lat: 14.5995,
      lng: 120.9842,
      name: 'Manila, Philippines'
    },
    confirmed: false,
    resources: [
      { type: 'Emergency Food Rations', quantity: 500000, unit: 'packages' },
      { type: 'Medical Emergency Kits', quantity: 60000, unit: 'kits' },
      { type: 'Emergency Tents', quantity: 200000, unit: 'tents' }
    ],
    estimatedDuration: '8 hours',
    priority: 'critical'
  },
  {
    id: 'typhoon-route-tokyo',
    origin: {
      lat: 35.6762,
      lng: 139.6503,
      name: 'Tokyo Distribution Center'
    },
    destination: {
      lat: 14.5995,
      lng: 120.9842,
      name: 'Manila, Philippines'
    },
    confirmed: false,
    resources: [
      { type: 'Water Purification Systems', quantity: 15000, unit: 'systems' },
      { type: 'Search Equipment', quantity: 1000, unit: 'sets' },
      { type: 'Emergency Tents', quantity: 400000, unit: 'tents' },
      { type: 'Medical Emergency Kits', quantity: 120000, unit: 'kits' }
    ],
    estimatedDuration: '6 hours',
    priority: 'critical'
  }
];

export const getDemoTimeline = () => {
  const now = Date.now();
  return {
    // Typhoon appears at 13 minutes into demo
    typhoonTrigger: now + (13 * 60 * 1000),
    // Pre-positioning alert appears 30 seconds after typhoon detection
    prepositioningAlert: now + (13 * 60 * 1000) + (30 * 1000),
    // Auto-matching starts 2 minutes after typhoon appears
    autoMatchingStart: now + (15 * 60 * 1000)
  };
}; 