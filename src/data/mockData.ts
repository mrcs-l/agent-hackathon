import { Disaster, OperationalCenter, Shipment, Alert, Route } from '../types';

export const mockDisasters: Disaster[] = [
  {
    id: 'disaster-1',
    name: 'Hurricane Maria',
    type: 'hurricane',
    severity: 'critical',
    location: {
      lat: 18.2208,
      lng: -66.5901,
      name: 'San Juan, Puerto Rico'
    },
    affectedPopulation: 3400000,
    dateTime: '2024-07-20T14:30:00Z',
    needs: [
      { id: '1', category: 'Water', specificItem: 'Bottled Water (1L)', quantityRequested: 5000000, quantityMatched: 3500000, priority: 'high', source: 'FEMA' },
      { id: '2', category: 'Food', specificItem: 'Emergency Food Rations', quantityRequested: 2000000, quantityMatched: 1500000, priority: 'high', source: 'Red Cross' },
      { id: '3', category: 'Medical', specificItem: 'First Aid Kits', quantityRequested: 50000, quantityMatched: 35000, priority: 'high', source: 'WHO' },
      { id: '4', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 100000, quantityMatched: 75000, priority: 'high', source: 'UNHCR' }
    ]
  },
  {
    id: 'disaster-2',
    name: 'Earthquake in Turkey',
    type: 'earthquake',
    severity: 'critical',
    location: {
      lat: 37.0662,
      lng: 37.3833,
      name: 'Gaziantep, Turkey'
    },
    affectedPopulation: 15000000,
    dateTime: '2024-07-22T08:15:00Z',
    needs: [
      { id: '5', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 1000, quantityMatched: 800, priority: 'high', source: 'UNDAC' },
      { id: '6', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 100000, quantityMatched: 75000, priority: 'high', source: 'WHO' },
      { id: '7', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 500000, quantityMatched: 400000, priority: 'high', source: 'UNHCR' },
      { id: '8', category: 'Water', specificItem: 'Water Containers', quantityRequested: 10000000, quantityMatched: 7000000, priority: 'high', source: 'UNICEF' }
    ]
  },
  {
    id: 'disaster-3',
    name: 'Flooding in Pakistan',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: 30.3753,
      lng: 69.3451,
      name: 'Quetta, Pakistan'
    },
    affectedPopulation: 33000000,
    dateTime: '2024-07-18T22:00:00Z',
    needs: [
      { id: '9', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 50000, quantityMatched: 35000, priority: 'high', source: 'UNICEF' },
      { id: '10', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 1000000, quantityMatched: 750000, priority: 'high', source: 'UNHCR' },
      { id: '11', category: 'Food', specificItem: 'Food Rations', quantityRequested: 5000000, quantityMatched: 3500000, priority: 'high', source: 'WFP' },
      { id: '12', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 200000, quantityMatched: 150000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-4',
    name: 'Wildfire in Australia',
    type: 'wildfire',
    severity: 'high',
    location: {
      lat: -33.8688,
      lng: 151.2093,
      name: 'Sydney, Australia'
    },
    affectedPopulation: 5000000,
    dateTime: '2024-07-21T10:45:00Z',
    needs: [
      { id: '13', category: 'Firefighting', specificItem: 'Fire Equipment', quantityRequested: 5000, quantityMatched: 4000, priority: 'high', source: 'Local Fire Dept' },
      { id: '14', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 100000, quantityMatched: 75000, priority: 'high', source: 'Red Cross' },
      { id: '15', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 50000, quantityMatched: 35000, priority: 'medium', source: 'WHO' },
      { id: '16', category: 'Water', specificItem: 'Water Containers', quantityRequested: 2000000, quantityMatched: 1500000, priority: 'medium', source: 'UNICEF' }
    ]
  },
  {
    id: 'disaster-5',
    name: 'Tornado Outbreak',
    type: 'tornado',
    severity: 'high',
    location: {
      lat: 39.8283,
      lng: -98.5795,
      name: 'Kansas, USA'
    },
    affectedPopulation: 2000000,
    dateTime: '2024-07-19T16:20:00Z',
    needs: [
      { id: '17', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 50000, quantityMatched: 40000, priority: 'high', source: 'FEMA' },
      { id: '18', category: 'Medical', specificItem: 'First Aid Kits', quantityRequested: 25000, quantityMatched: 20000, priority: 'high', source: 'Red Cross' },
      { id: '19', category: 'Food', specificItem: 'Food Rations', quantityRequested: 1000000, quantityMatched: 750000, priority: 'high', source: 'WFP' },
      { id: '20', category: 'Water', specificItem: 'Water Containers', quantityRequested: 1000000, quantityMatched: 750000, priority: 'medium', source: 'UNICEF' }
    ]
  },
  {
    id: 'disaster-6',
    name: 'Earthquake in Japan',
    type: 'earthquake',
    severity: 'critical',
    location: {
      lat: 35.6762,
      lng: 139.6503,
      name: 'Tokyo, Japan'
    },
    affectedPopulation: 14000000,
    dateTime: '2024-07-23T12:30:00Z',
    needs: [
      { id: '21', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 2000, quantityMatched: 1800, priority: 'high', source: 'JDR' },
      { id: '22', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 200000, quantityMatched: 150000, priority: 'high', source: 'WHO' },
      { id: '23', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 300000, quantityMatched: 250000, priority: 'high', source: 'UNHCR' },
      { id: '24', category: 'Water', specificItem: 'Water Containers', quantityRequested: 5000000, quantityMatched: 4000000, priority: 'high', source: 'UNICEF' }
    ]
  },
  {
    id: 'disaster-7',
    name: 'Flooding in Brazil',
    type: 'flood',
    severity: 'high',
    location: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'São Paulo, Brazil'
    },
    affectedPopulation: 12000000,
    dateTime: '2024-07-17T09:15:00Z',
    needs: [
      { id: '25', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 30000, quantityMatched: 25000, priority: 'high', source: 'UNICEF' },
      { id: '26', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 400000, quantityMatched: 300000, priority: 'high', source: 'UNHCR' },
      { id: '27', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 120000, quantityMatched: 90000, priority: 'high', source: 'WHO' },
      { id: '28', category: 'Food', specificItem: 'Food Rations', quantityRequested: 2500000, quantityMatched: 2000000, priority: 'medium', source: 'WFP' }
    ]
  },
  {
    id: 'disaster-8',
    name: 'Wildfire in Canada',
    type: 'wildfire',
    severity: 'high',
    location: {
      lat: 53.5461,
      lng: -113.4938,
      name: 'Edmonton, Canada'
    },
    affectedPopulation: 3000000,
    dateTime: '2024-07-24T14:45:00Z',
    needs: [
      { id: '29', category: 'Firefighting', specificItem: 'Fire Equipment', quantityRequested: 3000, quantityMatched: 2500, priority: 'high', source: 'Local Fire Dept' },
      { id: '30', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 150000, quantityMatched: 120000, priority: 'high', source: 'Red Cross' },
      { id: '31', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 60000, quantityMatched: 45000, priority: 'medium', source: 'WHO' },
      { id: '32', category: 'Water', specificItem: 'Water Containers', quantityRequested: 1500000, quantityMatched: 1200000, priority: 'medium', source: 'UNICEF' }
    ]
  }
];

export const mockOperationalCenters: OperationalCenter[] = [
  {
    id: 'center-1',
    name: 'Dallas Distribution Center',
    location: {
      lat: 32.7767,
      lng: -96.7970,
      name: 'Dallas, Texas, USA'
    },
    inventoryStatus: 'ample',
    totalItems: 250000,
    totalCategories: 45,
    inventoryValue: 8500000,
    inventory: [
      {
        id: 'item-1',
        productType: 'Water',
        specificItem: 'Bottled Water (1L)',
        quantity: 50000,
        corporatePartner: 'Coca-Cola',
        dateReceived: '2024-07-15',
        location: 'Warehouse A',
        condition: 'new'
      },
      {
        id: 'item-2',
        productType: 'Food',
        specificItem: 'Emergency Food Rations',
        quantity: 25000,
        corporatePartner: 'General Mills',
        dateReceived: '2024-07-10',
        location: 'Warehouse B',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-2',
    name: 'Atlanta Hub',
    location: {
      lat: 33.7490,
      lng: -84.3880,
      name: 'Atlanta, Georgia, USA'
    },
    inventoryStatus: 'moderate',
    totalItems: 180000,
    totalCategories: 38,
    inventoryValue: 6200000,
    inventory: [
      {
        id: 'item-3',
        productType: 'Medical',
        specificItem: 'First Aid Kits',
        quantity: 10000,
        corporatePartner: 'Johnson & Johnson',
        dateReceived: '2024-07-12',
        location: 'Warehouse C',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-3',
    name: 'Seattle Warehouse',
    location: {
      lat: 47.6062,
      lng: -122.3321,
      name: 'Seattle, Washington, USA'
    },
    inventoryStatus: 'ample',
    totalItems: 220000,
    totalCategories: 42,
    inventoryValue: 7800000,
    inventory: [
      {
        id: 'item-4',
        productType: 'Medical',
        specificItem: 'First Aid Kits',
        quantity: 10000,
        corporatePartner: 'Microsoft',
        dateReceived: '2024-07-08',
        location: 'Warehouse D',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-4',
    name: 'London Distribution Center',
    location: {
      lat: 51.5074,
      lng: -0.1278,
      name: 'London, UK'
    },
    inventoryStatus: 'ample',
    totalItems: 300000,
    totalCategories: 50,
    inventoryValue: 12000000,
    inventory: [
      {
        id: 'item-5',
        productType: 'Shelter',
        specificItem: 'Emergency Tents',
        quantity: 5000,
        corporatePartner: 'Unilever',
        dateReceived: '2024-07-14',
        location: 'Warehouse E',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-5',
    name: 'Frankfurt Hub',
    location: {
      lat: 50.1109,
      lng: 8.6821,
      name: 'Frankfurt, Germany'
    },
    inventoryStatus: 'moderate',
    totalItems: 200000,
    totalCategories: 40,
    inventoryValue: 8500000,
    inventory: [
      {
        id: 'item-6',
        productType: 'Medical',
        specificItem: 'Medical Kits',
        quantity: 8000,
        corporatePartner: 'Bayer',
        dateReceived: '2024-07-11',
        location: 'Warehouse F',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-6',
    name: 'Dubai Distribution Center',
    location: {
      lat: 25.2048,
      lng: 55.2708,
      name: 'Dubai, UAE'
    },
    inventoryStatus: 'ample',
    totalItems: 280000,
    totalCategories: 48,
    inventoryValue: 11000000,
    inventory: [
      {
        id: 'item-7',
        productType: 'Water',
        specificItem: 'Water Purification Systems',
        quantity: 2000,
        corporatePartner: 'Emirates',
        dateReceived: '2024-07-13',
        location: 'Warehouse G',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-7',
    name: 'Singapore Hub',
    location: {
      lat: 1.3521,
      lng: 103.8198,
      name: 'Singapore'
    },
    inventoryStatus: 'ample',
    totalItems: 320000,
    totalCategories: 55,
    inventoryValue: 13500000,
    inventory: [
      {
        id: 'item-8',
        productType: 'Food',
        specificItem: 'Food Rations',
        quantity: 15000,
        corporatePartner: 'Singapore Airlines',
        dateReceived: '2024-07-09',
        location: 'Warehouse H',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-8',
    name: 'Tokyo Distribution Center',
    location: {
      lat: 35.6762,
      lng: 139.6503,
      name: 'Tokyo, Japan'
    },
    inventoryStatus: 'moderate',
    totalItems: 250000,
    totalCategories: 45,
    inventoryValue: 10000000,
    inventory: [
      {
        id: 'item-9',
        productType: 'Medical',
        specificItem: 'Medical Kits',
        quantity: 12000,
        corporatePartner: 'Toyota',
        dateReceived: '2024-07-16',
        location: 'Warehouse I',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-9',
    name: 'Sydney Hub',
    location: {
      lat: -33.8688,
      lng: 151.2093,
      name: 'Sydney, Australia'
    },
    inventoryStatus: 'moderate',
    totalItems: 180000,
    totalCategories: 35,
    inventoryValue: 7500000,
    inventory: [
      {
        id: 'item-10',
        productType: 'Shelter',
        specificItem: 'Emergency Tents',
        quantity: 3000,
        corporatePartner: 'BHP',
        dateReceived: '2024-07-07',
        location: 'Warehouse J',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-10',
    name: 'São Paulo Distribution Center',
    location: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'São Paulo, Brazil'
    },
    inventoryStatus: 'low',
    totalItems: 120000,
    totalCategories: 30,
    inventoryValue: 4500000,
    inventory: [
      {
        id: 'item-11',
        productType: 'Water',
        specificItem: 'Water Containers',
        quantity: 8000,
        corporatePartner: 'Vale',
        dateReceived: '2024-07-05',
        location: 'Warehouse K',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-11',
    name: 'Mumbai Hub',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      name: 'Mumbai, India'
    },
    inventoryStatus: 'moderate',
    totalItems: 200000,
    totalCategories: 40,
    inventoryValue: 6500000,
    inventory: [
      {
        id: 'item-12',
        productType: 'Food',
        specificItem: 'Food Rations',
        quantity: 20000,
        corporatePartner: 'Tata Group',
        dateReceived: '2024-07-12',
        location: 'Warehouse L',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-12',
    name: 'Cape Town Distribution Center',
    location: {
      lat: -33.9249,
      lng: 18.4241,
      name: 'Cape Town, South Africa'
    },
    inventoryStatus: 'low',
    totalItems: 100000,
    totalCategories: 25,
    inventoryValue: 3500000,
    inventory: [
      {
        id: 'item-13',
        productType: 'Medical',
        specificItem: 'Medical Kits',
        quantity: 5000,
        corporatePartner: 'De Beers',
        dateReceived: '2024-07-10',
        location: 'Warehouse M',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-13',
    name: 'Mexico City Hub',
    location: {
      lat: 19.4326,
      lng: -99.1332,
      name: 'Mexico City, Mexico'
    },
    inventoryStatus: 'moderate',
    totalItems: 160000,
    totalCategories: 35,
    inventoryValue: 5500000,
    inventory: [
      {
        id: 'item-14',
        productType: 'Shelter',
        specificItem: 'Emergency Tents',
        quantity: 4000,
        corporatePartner: 'Cemex',
        dateReceived: '2024-07-11',
        location: 'Warehouse N',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-14',
    name: 'Toronto Distribution Center',
    location: {
      lat: 43.6532,
      lng: -79.3832,
      name: 'Toronto, Canada'
    },
    inventoryStatus: 'ample',
    totalItems: 240000,
    totalCategories: 45,
    inventoryValue: 9000000,
    inventory: [
      {
        id: 'item-15',
        productType: 'Water',
        specificItem: 'Water Purification Systems',
        quantity: 1500,
        corporatePartner: 'Rogers Communications',
        dateReceived: '2024-07-13',
        location: 'Warehouse O',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-15',
    name: 'Istanbul Hub',
    location: {
      lat: 41.0082,
      lng: 28.9784,
      name: 'Istanbul, Turkey'
    },
    inventoryStatus: 'moderate',
    totalItems: 170000,
    totalCategories: 38,
    inventoryValue: 6000000,
    inventory: [
      {
        id: 'item-16',
        productType: 'Medical',
        specificItem: 'Medical Kits',
        quantity: 7000,
        corporatePartner: 'Turkish Airlines',
        dateReceived: '2024-07-09',
        location: 'Warehouse P',
        condition: 'new'
      }
    ]
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
    relatedType: 'disaster',
    status: 'active'
  },
  {
    id: '2',
    type: 'urgent',
    message: 'Shipment ATB-789 to Miami Delayed by 12 hours - Road Closure.',
    timestamp: '2024-07-24T14:15:00Z',
    relatedId: 'ATB-789',
    relatedType: 'shipment',
    status: 'active',
    recommendations: [
      {
        id: 'rec-1',
        title: 'Alternative Route Recommendation',
        description: 'Agentforce has identified an optimal alternative route via I-95 South that avoids the closure. This route adds minimal time but ensures on-schedule delivery.',
        costImpact: '+$850',
        timeImpact: '+2.5 hours',
        actions: [
          { id: 'act-1', label: 'Approve Route Change', type: 'approve', primary: true },
          { id: 'act-2', label: 'View on Map', type: 'view_route' },
          { id: 'act-3', label: 'Contact Driver', type: 'contact' }
        ]
      }
    ]
  },
  {
    id: '3',
    type: 'urgent',
    message: 'Inventory Low for Water Filters at Seattle Warehouse.',
    timestamp: '2024-07-24T11:00:00Z',
    relatedId: '3',
    relatedType: 'inventory',
    status: 'awaiting_resolution',
    recommendations: [
      {
        id: 'rec-2',
        title: 'Emergency Transfer from Portland Hub',
        description: 'Transfer 15,000 water filters from Portland Hub (2 hours away) to meet projected demand. Alternative: Rush order from supplier with overnight delivery.',
        costImpact: '+$2,400',
        timeImpact: '4 hours',
        actions: [
          { id: 'act-4', label: 'Approve Transfer', type: 'approve', primary: true },
          { id: 'act-5', label: 'Contact Portland Hub', type: 'contact' },
          { id: 'act-6', label: 'Report Inventory Issue', type: 'report_issue' }
        ]
      }
    ]
  },
  {
    id: '4',
    type: 'urgent',
    message: 'Typhoon Genesis approaching Philippines - New disaster zone detected.',
    timestamp: '2024-07-24T16:45:00Z',
    relatedId: 'disaster-typhoon-1',
    relatedType: 'disaster',
    status: 'active',
    recommendations: [
      {
        id: 'rec-3',
        title: 'Pre-position Emergency Resources',
        description: 'Agentforce recommends pre-positioning emergency supplies from Singapore and Tokyo hubs. Estimated 2.3M people in potential impact zone.',
        costImpact: '+$45,000',
        timeImpact: '12 hours prep time',
        actions: [
          { id: 'act-7', label: 'Approve Pre-positioning', type: 'approve', primary: true },
          { id: 'act-8', label: 'View Deployment Routes', type: 'view_route' },
          { id: 'act-9', label: 'Contact Regional Hubs', type: 'contact' }
        ]
      }
    ]
  },
  {
    id: '5',
    type: 'info',
    message: 'New Corporate Partner Onboarded: "Global Tech Inc."',
    timestamp: '2024-07-24T09:00:00Z',
    status: 'resolved'
  },
  {
    id: '6',
    type: 'info',
    message: 'Weekly Impact Report Generated.',
    timestamp: '2024-07-24T08:00:00Z',
    status: 'resolved'
  },
  {
    id: '7',
    type: 'info',
    message: 'Agentforce System Health: All systems operational.',
    timestamp: '2024-07-24T07:30:00Z',
    status: 'active'
  }
];

export const mockRoutes: Route[] = [
  {
    id: 'route-1',
    origin: {
      lat: 32.7767,
      lng: -96.7970,
      name: 'Dallas Distribution Center'
    },
    destination: {
      lat: 18.2208,
      lng: -66.5901,
      name: 'San Juan, Puerto Rico'
    },
    confirmed: true,
    resources: [
      { type: 'Bottled Water', quantity: 50000, unit: 'bottles' },
      { type: 'Food Rations', quantity: 25000, unit: 'packages' },
      { type: 'Medical Supplies', quantity: 1000, unit: 'kits' }
    ],
    estimatedDuration: '18 hours',
    priority: 'critical'
  },
  {
    id: 'route-2',
    origin: {
      lat: 33.7490,
      lng: -84.3880,
      name: 'Atlanta Hub'
    },
    destination: {
      lat: 37.0662,
      lng: 37.3833,
      name: 'Gaziantep, Turkey'
    },
    confirmed: false,
    resources: [
      { type: 'Emergency Tents', quantity: 2000, unit: 'tents' },
      { type: 'Medical Kits', quantity: 5000, unit: 'kits' }
    ],
    estimatedDuration: '36 hours',
    priority: 'critical'
  },
  {
    id: 'route-3',
    origin: {
      lat: 47.6062,
      lng: -122.3321,
      name: 'Seattle Warehouse'
    },
    destination: {
      lat: 30.3753,
      lng: 69.3451,
      name: 'Quetta, Pakistan'
    },
    confirmed: true,
    resources: [
      { type: 'First Aid Kits', quantity: 10000, unit: 'kits' },
      { type: 'Water Purification Tablets', quantity: 50000, unit: 'tablets' }
    ],
    estimatedDuration: '28 hours',
    priority: 'critical'
  },
  {
    id: 'route-4',
    origin: {
      lat: 51.5074,
      lng: -0.1278,
      name: 'London Distribution Center'
    },
    destination: {
      lat: -33.8688,
      lng: 151.2093,
      name: 'Sydney, Australia'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Tents', quantity: 3000, unit: 'tents' },
      { type: 'Medical Supplies', quantity: 8000, unit: 'kits' }
    ],
    estimatedDuration: '42 hours',
    priority: 'high'
  },
  {
    id: 'route-5',
    origin: {
      lat: 50.1109,
      lng: 8.6821,
      name: 'Frankfurt Hub'
    },
    destination: {
      lat: 35.6762,
      lng: 139.6503,
      name: 'Tokyo, Japan'
    },
    confirmed: true,
    resources: [
      { type: 'Medical Kits', quantity: 12000, unit: 'kits' },
      { type: 'Search Equipment', quantity: 500, unit: 'sets' }
    ],
    estimatedDuration: '38 hours',
    priority: 'critical'
  },
  {
    id: 'route-6',
    origin: {
      lat: 25.2048,
      lng: 55.2708,
      name: 'Dubai Distribution Center'
    },
    destination: {
      lat: 23.6850,
      lng: 90.3563,
      name: 'Dhaka, Bangladesh'
    },
    confirmed: false,
    resources: [
      { type: 'Water Purification Systems', quantity: 2000, unit: 'systems' },
      { type: 'Emergency Tents', quantity: 8000, unit: 'tents' }
    ],
    estimatedDuration: '24 hours',
    priority: 'critical'
  },
  {
    id: 'route-7',
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
    confirmed: true,
    resources: [
      { type: 'Food Rations', quantity: 15000, unit: 'packages' },
      { type: 'Medical Kits', quantity: 18000, unit: 'kits' }
    ],
    estimatedDuration: '12 hours',
    priority: 'critical'
  },
  {
    id: 'route-8',
    origin: {
      lat: 19.0760,
      lng: 72.8777,
      name: 'Mumbai Hub'
    },
    destination: {
      lat: 30.3753,
      lng: 69.3451,
      name: 'Quetta, Pakistan'
    },
    confirmed: true,
    resources: [
      { type: 'Food Rations', quantity: 20000, unit: 'packages' },
      { type: 'Emergency Tents', quantity: 10000, unit: 'tents' }
    ],
    estimatedDuration: '8 hours',
    priority: 'critical'
  },
  {
    id: 'route-9',
    origin: {
      lat: -33.9249,
      lng: 18.4241,
      name: 'Cape Town Distribution Center'
    },
    destination: {
      lat: -1.2921,
      lng: 36.8219,
      name: 'Nairobi, Kenya'
    },
    confirmed: false,
    resources: [
      { type: 'Medical Kits', quantity: 5000, unit: 'kits' },
      { type: 'Water Containers', quantity: 12000, unit: 'containers' }
    ],
    estimatedDuration: '16 hours',
    priority: 'high'
  },
  {
    id: 'route-10',
    origin: {
      lat: 19.4326,
      lng: -99.1332,
      name: 'Mexico City Hub'
    },
    destination: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'São Paulo, Brazil'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Tents', quantity: 4000, unit: 'tents' },
      { type: 'Medical Supplies', quantity: 12000, unit: 'kits' }
    ],
    estimatedDuration: '20 hours',
    priority: 'high'
  },
  {
    id: 'route-11',
    origin: {
      lat: 43.6532,
      lng: -79.3832,
      name: 'Toronto Distribution Center'
    },
    destination: {
      lat: 53.5461,
      lng: -113.4938,
      name: 'Edmonton, Canada'
    },
    confirmed: true,
    resources: [
      { type: 'Water Purification Systems', quantity: 1500, unit: 'systems' },
      { type: 'Firefighting Equipment', quantity: 3000, unit: 'sets' }
    ],
    estimatedDuration: '6 hours',
    priority: 'high'
  },
  {
    id: 'route-12',
    origin: {
      lat: 41.0082,
      lng: 28.9784,
      name: 'Istanbul Hub'
    },
    destination: {
      lat: 37.0662,
      lng: 37.3833,
      name: 'Gaziantep, Turkey'
    },
    confirmed: true,
    resources: [
      { type: 'Medical Kits', quantity: 7000, unit: 'kits' },
      { type: 'Search Equipment', quantity: 1000, unit: 'sets' }
    ],
    estimatedDuration: '4 hours',
    priority: 'critical'
  },
  {
    id: 'route-13',
    origin: {
      lat: 32.7767,
      lng: -96.7970,
      name: 'Dallas Distribution Center'
    },
    destination: {
      lat: 39.8283,
      lng: -98.5795,
      name: 'Kansas, USA'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Tents', quantity: 50000, unit: 'tents' },
      { type: 'Medical Supplies', quantity: 25000, unit: 'kits' }
    ],
    estimatedDuration: '8 hours',
    priority: 'high'
  },
  {
    id: 'route-14',
    origin: {
      lat: 51.5074,
      lng: -0.1278,
      name: 'London Distribution Center'
    },
    destination: {
      lat: 37.0662,
      lng: 37.3833,
      name: 'Gaziantep, Turkey'
    },
    confirmed: false,
    resources: [
      { type: 'Emergency Tents', quantity: 500000, unit: 'tents' },
      { type: 'Medical Kits', quantity: 100000, unit: 'kits' }
    ],
    estimatedDuration: '32 hours',
    priority: 'critical'
  },
  {
    id: 'route-15',
    origin: {
      lat: 1.3521,
      lng: 103.8198,
      name: 'Singapore Hub'
    },
    destination: {
      lat: 30.3753,
      lng: 69.3451,
      name: 'Quetta, Pakistan'
    },
    confirmed: true,
    resources: [
      { type: 'Water Purification Systems', quantity: 50000, unit: 'systems' },
      { type: 'Emergency Tents', quantity: 1000000, unit: 'tents' }
    ],
    estimatedDuration: '16 hours',
    priority: 'critical'
  },
  {
    id: 'route-16',
    origin: {
      lat: 25.2048,
      lng: 55.2708,
      name: 'Dubai Distribution Center'
    },
    destination: {
      lat: 35.6762,
      lng: 139.6503,
      name: 'Tokyo, Japan'
    },
    confirmed: true,
    resources: [
      { type: 'Medical Kits', quantity: 200000, unit: 'kits' },
      { type: 'Search Equipment', quantity: 2000, unit: 'sets' }
    ],
    estimatedDuration: '26 hours',
    priority: 'critical'
  },
  {
    id: 'route-17',
    origin: {
      lat: -33.9249,
      lng: 18.4241,
      name: 'Cape Town Distribution Center'
    },
    destination: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'São Paulo, Brazil'
    },
    confirmed: false,
    resources: [
      { type: 'Medical Kits', quantity: 120000, unit: 'kits' },
      { type: 'Emergency Tents', quantity: 400000, unit: 'tents' }
    ],
    estimatedDuration: '28 hours',
    priority: 'high'
  },
  {
    id: 'route-18',
    origin: {
      lat: 43.6532,
      lng: -79.3832,
      name: 'Toronto Distribution Center'
    },
    destination: {
      lat: 53.5461,
      lng: -113.4938,
      name: 'Edmonton, Canada'
    },
    confirmed: true,
    resources: [
      { type: 'Firefighting Equipment', quantity: 3000, unit: 'sets' },
      { type: 'Emergency Tents', quantity: 150000, unit: 'tents' }
    ],
    estimatedDuration: '6 hours',
    priority: 'high'
  },
  {
    id: 'route-19',
    origin: {
      lat: 19.0760,
      lng: 72.8777,
      name: 'Mumbai Hub'
    },
    destination: {
      lat: 23.6850,
      lng: 90.3563,
      name: 'Dhaka, Bangladesh'
    },
    confirmed: true,
    resources: [
      { type: 'Water', quantity: 8000000, unit: 'liters' },
      { type: 'Emergency Tents', quantity: 800000, unit: 'tents' }
    ],
    estimatedDuration: '12 hours',
    priority: 'critical'
  },
  {
    id: 'route-20',
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
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 1500, unit: 'sets' },
      { type: 'Emergency Tents', quantity: 600000, unit: 'tents' }
    ],
    estimatedDuration: '12 hours',
    priority: 'critical'
  }
];