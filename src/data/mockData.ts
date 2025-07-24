import { Disaster, OperationalCenter, Shipment, Alert } from '../types';

export const mockDisasters: Disaster[] = [
  {
    id: '1',
    name: 'Hurricane Delta',
    type: 'hurricane',
    location: {
      lat: 25.7617,
      lng: -80.1918,
      name: 'Miami, Florida'
    },
    severity: 'critical',
    affectedPopulation: 2500000,
    dateTime: '2024-07-20T14:30:00Z',
    needs: [
      {
        id: '1',
        category: 'Water',
        specificItem: 'Bottled Water (1L)',
        quantityRequested: 500000,
        quantityMatched: 350000,
        priority: 'high',
        source: 'FEMA'
      },
      {
        id: '2',
        category: 'Food',
        specificItem: 'Emergency Food Rations',
        quantityRequested: 200000,
        quantityMatched: 150000,
        priority: 'high',
        source: 'Red Cross'
      }
    ]
  },
  {
    id: '2',
    name: 'Earthquake Zeta',
    type: 'earthquake',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      name: 'San Francisco, California'
    },
    severity: 'high',
    affectedPopulation: 875000,
    dateTime: '2024-07-22T08:15:00Z',
    needs: [
      {
        id: '3',
        category: 'Shelter',
        specificItem: 'Emergency Tents',
        quantityRequested: 15000,
        quantityMatched: 8000,
        priority: 'high',
        source: 'Local Government'
      }
    ]
  },
  {
    id: '3',
    name: 'Midwest Floods',
    type: 'flood',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      name: 'Chicago, Illinois'
    },
    severity: 'medium',
    affectedPopulation: 1200000,
    dateTime: '2024-07-18T22:00:00Z',
    needs: [
      {
        id: '4',
        category: 'Medical',
        specificItem: 'First Aid Kits',
        quantityRequested: 25000,
        quantityMatched: 20000,
        priority: 'medium',
        source: 'Local NGOs'
      }
    ]
  }
];

export const mockOperationalCenters: OperationalCenter[] = [
  {
    id: '1',
    name: 'Dallas Distribution Center',
    location: {
      lat: 32.7767,
      lng: -96.7970,
      name: 'Dallas, Texas'
    },
    inventoryStatus: 'ample',
    totalItems: 125000,
    totalCategories: 45,
    inventoryValue: 2500000,
    inventory: []
  },
  {
    id: '2',
    name: 'Atlanta Hub',
    location: {
      lat: 33.7490,
      lng: -84.3880,
      name: 'Atlanta, Georgia'
    },
    inventoryStatus: 'moderate',
    totalItems: 85000,
    totalCategories: 38,
    inventoryValue: 1800000,
    inventory: []
  },
  {
    id: '3',
    name: 'Seattle Warehouse',
    location: {
      lat: 47.6062,
      lng: -122.3321,
      name: 'Seattle, Washington'
    },
    inventoryStatus: 'low',
    totalItems: 35000,
    totalCategories: 22,
    inventoryValue: 750000,
    inventory: []
  }
];

export const mockShipments: Shipment[] = [
  {
    id: 'ATB-789',
    origin: 'Dallas Distribution Center',
    destination: 'Miami, Florida',
    status: 'delayed',
    estimatedArrival: '2024-07-25T16:00:00Z',
    currentLocation: {
      lat: 30.3322,
      lng: -81.6557,
      name: 'Jacksonville, FL'
    },
    logisticsPartner: 'FedEx Logistics',
    manifest: [
      {
        item: 'Bottled Water (1L)',
        quantity: 50000,
        unit: 'bottles',
        corporateDonor: 'Coca-Cola'
      },
      {
        item: 'Emergency Food Rations',
        quantity: 25000,
        unit: 'packages',
        corporateDonor: 'General Mills'
      }
    ],
    timeline: [
      {
        timestamp: '2024-07-23T09:00:00Z',
        event: 'Loaded at Dallas Distribution Center'
      },
      {
        timestamp: '2024-07-23T10:30:00Z',
        event: 'Departed Dallas Distribution Center'
      },
      {
        timestamp: '2024-07-24T14:00:00Z',
        event: 'Delayed due to road closure',
        location: 'I-10 near Houston'
      }
    ]
  },
  {
    id: 'ATB-790',
    origin: 'Atlanta Hub',
    destination: 'San Francisco, California',
    status: 'in_transit',
    estimatedArrival: '2024-07-26T12:00:00Z',
    currentLocation: {
      lat: 39.1612,
      lng: -75.5264,
      name: 'Denver, CO'
    },
    logisticsPartner: 'UPS Supply Chain',
    manifest: [
      {
        item: 'Emergency Tents',
        quantity: 2000,
        unit: 'tents',
        corporateDonor: 'REI Co-op'
      }
    ],
    timeline: [
      {
        timestamp: '2024-07-24T08:00:00Z',
        event: 'Loaded at Atlanta Hub'
      },
      {
        timestamp: '2024-07-24T09:15:00Z',
        event: 'Departed Atlanta Hub'
      }
    ]
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'urgent',
    message: 'Disaster Severity Upgrade: Hurricane Delta now "Critical" in Florida.',
    timestamp: '2024-07-24T10:30:00Z',
    relatedId: '1',
    relatedType: 'disaster'
  },
  {
    id: '2',
    type: 'urgent',
    message: 'Shipment ATB-789 to Miami Delayed by 12 hours - Road Closure.',
    timestamp: '2024-07-24T14:15:00Z',
    relatedId: 'ATB-789',
    relatedType: 'shipment'
  },
  {
    id: '3',
    type: 'urgent',
    message: 'Inventory Low for Water Filters at Seattle Warehouse.',
    timestamp: '2024-07-24T11:00:00Z',
    relatedId: '3',
    relatedType: 'inventory'
  },
  {
    id: '4',
    type: 'info',
    message: 'New Corporate Partner Onboarded: "Global Tech Inc."',
    timestamp: '2024-07-24T09:00:00Z'
  },
  {
    id: '5',
    type: 'info',
    message: 'Weekly Impact Report Generated.',
    timestamp: '2024-07-24T08:00:00Z'
  },
  {
    id: '6',
    type: 'info',
    message: 'Agentforce System Health: All systems operational.',
    timestamp: '2024-07-24T07:30:00Z'
  }
];