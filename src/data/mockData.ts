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
  },
  {
    id: 'disaster-kenya',
    name: 'Flooding in Kenya',
    type: 'flood',
    severity: 'high',
    location: {
      lat: -1.2921,
      lng: 36.8219,
      name: 'Nairobi, Kenya'
    },
    affectedPopulation: 2500000,
    dateTime: '2024-07-25T09:00:00Z',
    needs: [
      { id: 'kenya-1', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 8000, quantityMatched: 5000, priority: 'high', source: 'Kenya Red Cross' },
      { id: 'kenya-2', category: 'Water', specificItem: 'Water Containers', quantityRequested: 20000, quantityMatched: 12000, priority: 'high', source: 'UNICEF' },
      { id: 'kenya-3', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 5000, quantityMatched: 2000, priority: 'medium', source: 'UNHCR' },
      { id: 'kenya-4', category: 'Food', specificItem: 'Food Rations', quantityRequested: 100000, quantityMatched: 60000, priority: 'medium', source: 'WFP' }
    ]
  },
  {
    id: 'disaster-dhaka',
    name: 'Flooding in Bangladesh',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: 23.6850,
      lng: 90.3563,
      name: 'Dhaka, Bangladesh'
    },
    affectedPopulation: 18000000,
    dateTime: '2024-07-26T10:00:00Z',
    needs: [
      { id: 'dhaka-1', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 100000, quantityMatched: 50000, priority: 'high', source: 'UNICEF' },
      { id: 'dhaka-2', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 200000, quantityMatched: 100000, priority: 'high', source: 'UNHCR' },
      { id: 'dhaka-3', category: 'Medical', specificItem: 'Medical Kits', quantityRequested: 50000, quantityMatched: 25000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-manila',
    name: 'Typhoon in the Philippines',
    type: 'hurricane',
    severity: 'high',
    location: {
      lat: 14.5995,
      lng: 120.9842,
      name: 'Manila, Philippines'
    },
    affectedPopulation: 12000000,
    dateTime: '2024-07-27T08:00:00Z',
    needs: [
      { id: 'manila-1', category: 'Food', specificItem: 'Emergency Food Rations', quantityRequested: 500000, quantityMatched: 200000, priority: 'high', source: 'WFP' },
      { id: 'manila-2', category: 'Medical', specificItem: 'Medical Emergency Kits', quantityRequested: 60000, quantityMatched: 30000, priority: 'high', source: 'WHO' },
      { id: 'manila-3', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 200000, quantityMatched: 100000, priority: 'high', source: 'UNHCR' }
    ]
  },
  // Additional Global Disasters
  {
    id: 'disaster-north-america-1',
    name: 'Hurricane Gabriella',
    type: 'hurricane',
    severity: 'critical',
    location: {
      lat: 25.7617,
      lng: -80.1918,
      name: 'Miami, Florida, USA'
    },
    affectedPopulation: 2800000,
    dateTime: '2024-08-01T06:00:00Z',
    needs: [
      { id: 'na1-1', category: 'Water', specificItem: 'Emergency Water Supply', quantityRequested: 2000000, quantityMatched: 800000, priority: 'high', source: 'FEMA' },
      { id: 'na1-2', category: 'Medical', specificItem: 'Medical Emergency Kits', quantityRequested: 50000, quantityMatched: 20000, priority: 'high', source: 'Red Cross' },
      { id: 'na1-3', category: 'Food', specificItem: 'Emergency Food Rations', quantityRequested: 1500000, quantityMatched: 600000, priority: 'high', source: 'Salvation Army' }
    ]
  },
  {
    id: 'disaster-north-america-2',
    name: 'California Wildfire Complex',
    type: 'wildfire',
    severity: 'critical',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Los Angeles, California, USA'
    },
    affectedPopulation: 4000000,
    dateTime: '2024-08-02T14:00:00Z',
    needs: [
      { id: 'na2-1', category: 'Firefighting', specificItem: 'Fire Retardant', quantityRequested: 10000, quantityMatched: 4000, priority: 'high', source: 'CAL FIRE' },
      { id: 'na2-2', category: 'Shelter', specificItem: 'Emergency Shelters', quantityRequested: 200000, quantityMatched: 80000, priority: 'high', source: 'Red Cross' },
      { id: 'na2-3', category: 'Medical', specificItem: 'Respiratory Protection', quantityRequested: 100000, quantityMatched: 40000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-north-america-3',
    name: 'Texas Tornado Outbreak',
    type: 'tornado',
    severity: 'high',
    location: {
      lat: 32.7555,
      lng: -97.3308,
      name: 'Fort Worth, Texas, USA'
    },
    affectedPopulation: 1200000,
    dateTime: '2024-08-03T18:30:00Z',
    needs: [
      { id: 'na3-1', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 80000, quantityMatched: 30000, priority: 'high', source: 'FEMA' },
      { id: 'na3-2', category: 'Medical', specificItem: 'Trauma Kits', quantityRequested: 15000, quantityMatched: 8000, priority: 'high', source: 'Red Cross' }
    ]
  },
  {
    id: 'disaster-north-america-4',
    name: 'Alaska Earthquake',
    type: 'earthquake',
    severity: 'high',
    location: {
      lat: 61.2181,
      lng: -149.9003,
      name: 'Anchorage, Alaska, USA'
    },
    affectedPopulation: 300000,
    dateTime: '2024-08-04T11:15:00Z',
    needs: [
      { id: 'na4-1', category: 'Shelter', specificItem: 'Cold Weather Shelters', quantityRequested: 20000, quantityMatched: 8000, priority: 'high', source: 'FEMA' },
      { id: 'na4-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 10000, quantityMatched: 6000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-north-america-5',
    name: 'Mississippi River Flooding',
    type: 'flood',
    severity: 'high',
    location: {
      lat: 38.6270,
      lng: -90.1994,
      name: 'St. Louis, Missouri, USA'
    },
    affectedPopulation: 2000000,
    dateTime: '2024-08-05T08:00:00Z',
    needs: [
      { id: 'na5-1', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 5000, quantityMatched: 2000, priority: 'high', source: 'EPA' },
      { id: 'na5-2', category: 'Shelter', specificItem: 'Flood Relief Shelters', quantityRequested: 100000, quantityMatched: 40000, priority: 'high', source: 'Red Cross' }
    ]
  },
  {
    id: 'disaster-north-america-6',
    name: 'Hurricane Derek',
    type: 'hurricane',
    severity: 'critical',
    location: {
      lat: 29.9511,
      lng: -90.0715,
      name: 'New Orleans, Louisiana, USA'
    },
    affectedPopulation: 1300000,
    dateTime: '2024-08-06T04:30:00Z',
    needs: [
      { id: 'na6-1', category: 'Water', specificItem: 'Emergency Water', quantityRequested: 3000000, quantityMatched: 1200000, priority: 'high', source: 'FEMA' },
      { id: 'na6-2', category: 'Medical', specificItem: 'Medical Emergency Kits', quantityRequested: 80000, quantityMatched: 32000, priority: 'high', source: 'Red Cross' }
    ]
  },
  {
    id: 'disaster-north-america-7',
    name: 'Vancouver Island Earthquake',
    type: 'earthquake',
    severity: 'high',
    location: {
      lat: 49.2827,
      lng: -123.1207,
      name: 'Vancouver, British Columbia, Canada'
    },
    affectedPopulation: 2500000,
    dateTime: '2024-08-07T16:45:00Z',
    needs: [
      { id: 'na7-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 2000, quantityMatched: 1200, priority: 'high', source: 'Canadian Emergency Management' },
      { id: 'na7-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 60000, quantityMatched: 24000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-south-america-1',
    name: 'Amazon Basin Flooding',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: -3.1190,
      lng: -60.0217,
      name: 'Manaus, Brazil'
    },
    affectedPopulation: 800000,
    dateTime: '2024-08-08T10:00:00Z',
    needs: [
      { id: 'sa1-1', category: 'Water', specificItem: 'Water Purification Tablets', quantityRequested: 200000, quantityMatched: 80000, priority: 'high', source: 'UNICEF' },
      { id: 'sa1-2', category: 'Medical', specificItem: 'Tropical Disease Kits', quantityRequested: 20000, quantityMatched: 8000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-south-america-2',
    name: 'Chilean Earthquake',
    type: 'earthquake',
    severity: 'critical',
    location: {
      lat: -33.4489,
      lng: -70.6693,
      name: 'Santiago, Chile'
    },
    affectedPopulation: 7000000,
    dateTime: '2024-08-09T07:20:00Z',
    needs: [
      { id: 'sa2-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 3000, quantityMatched: 1800, priority: 'high', source: 'ONEMI' },
      { id: 'sa2-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 150000, quantityMatched: 60000, priority: 'high', source: 'Red Cross' }
    ]
  },
  {
    id: 'disaster-south-america-3',
    name: 'Colombian Flooding',
    type: 'flood',
    severity: 'high',
    location: {
      lat: 4.7110,
      lng: -74.0721,
      name: 'Bogotá, Colombia'
    },
    affectedPopulation: 10000000,
    dateTime: '2024-08-10T12:30:00Z',
    needs: [
      { id: 'sa3-1', category: 'Shelter', specificItem: 'Emergency Shelters', quantityRequested: 500000, quantityMatched: 200000, priority: 'high', source: 'UNGRD' },
      { id: 'sa3-2', category: 'Water', specificItem: 'Clean Water Supply', quantityRequested: 5000000, quantityMatched: 2000000, priority: 'high', source: 'UNICEF' }
    ]
  },
  {
    id: 'disaster-south-america-4',
    name: 'Peruvian Earthquake',
    type: 'earthquake',
    severity: 'high',
    location: {
      lat: -12.0464,
      lng: -77.0428,
      name: 'Lima, Peru'
    },
    affectedPopulation: 10000000,
    dateTime: '2024-08-11T15:45:00Z',
    needs: [
      { id: 'sa4-1', category: 'Medical', specificItem: 'Emergency Medical Kits', quantityRequested: 200000, quantityMatched: 80000, priority: 'high', source: 'MINSA Peru' },
      { id: 'sa4-2', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 400000, quantityMatched: 160000, priority: 'high', source: 'INDECI' }
    ]
  },
  {
    id: 'disaster-europe-1',
    name: 'German Flooding',
    type: 'flood',
    severity: 'high',
    location: {
      lat: 50.1109,
      lng: 8.6821,
      name: 'Frankfurt, Germany'
    },
    affectedPopulation: 5000000,
    dateTime: '2024-08-12T09:00:00Z',
    needs: [
      { id: 'eu1-1', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 10000, quantityMatched: 4000, priority: 'high', source: 'THW Germany' },
      { id: 'eu1-2', category: 'Shelter', specificItem: 'Emergency Accommodations', quantityRequested: 200000, quantityMatched: 80000, priority: 'high', source: 'DRK' }
    ]
  },
  {
    id: 'disaster-europe-2',
    name: 'Italian Earthquake',
    type: 'earthquake',
    severity: 'critical',
    location: {
      lat: 41.9028,
      lng: 12.4964,
      name: 'Rome, Italy'
    },
    affectedPopulation: 4000000,
    dateTime: '2024-08-13T14:20:00Z',
    needs: [
      { id: 'eu2-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 2500, quantityMatched: 1500, priority: 'high', source: 'Protezione Civile' },
      { id: 'eu2-2', category: 'Medical', specificItem: 'Medical Emergency Supplies', quantityRequested: 100000, quantityMatched: 40000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-europe-3',
    name: 'Spanish Wildfire',
    type: 'wildfire',
    severity: 'high',
    location: {
      lat: 40.4168,
      lng: -3.7038,
      name: 'Madrid, Spain'
    },
    affectedPopulation: 6500000,
    dateTime: '2024-08-14T16:00:00Z',
    needs: [
      { id: 'eu3-1', category: 'Firefighting', specificItem: 'Fire Suppression Equipment', quantityRequested: 5000, quantityMatched: 2000, priority: 'high', source: 'SEPRONA' },
      { id: 'eu3-2', category: 'Medical', specificItem: 'Burn Treatment Supplies', quantityRequested: 30000, quantityMatched: 12000, priority: 'high', source: 'Red Cross Spain' }
    ]
  },
  {
    id: 'disaster-africa-1',
    name: 'Nigerian Flooding',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: 6.5244,
      lng: 3.3792,
      name: 'Lagos, Nigeria'
    },
    affectedPopulation: 15000000,
    dateTime: '2024-08-15T11:30:00Z',
    needs: [
      { id: 'af1-1', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 50000, quantityMatched: 20000, priority: 'high', source: 'NEMA Nigeria' },
      { id: 'af1-2', category: 'Medical', specificItem: 'Waterborne Disease Kits', quantityRequested: 80000, quantityMatched: 32000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-africa-2',
    name: 'South African Earthquake',
    type: 'earthquake',
    severity: 'high',
    location: {
      lat: -33.9249,
      lng: 18.4241,
      name: 'Cape Town, South Africa'
    },
    affectedPopulation: 4000000,
    dateTime: '2024-08-16T08:45:00Z',
    needs: [
      { id: 'af2-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 1500, quantityMatched: 900, priority: 'high', source: 'SAWS' },
      { id: 'af2-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 70000, quantityMatched: 28000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-africa-3',
    name: 'Ethiopian Drought Emergency',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: 9.1450,
      lng: 40.4897,
      name: 'Addis Ababa, Ethiopia'
    },
    affectedPopulation: 25000000,
    dateTime: '2024-08-17T06:00:00Z',
    needs: [
      { id: 'af3-1', category: 'Water', specificItem: 'Emergency Water Supply', quantityRequested: 10000000, quantityMatched: 4000000, priority: 'high', source: 'UNICEF' },
      { id: 'af3-2', category: 'Food', specificItem: 'Emergency Food Rations', quantityRequested: 15000000, quantityMatched: 6000000, priority: 'high', source: 'WFP' }
    ]
  },
  {
    id: 'disaster-asia-1',
    name: 'Indonesia Earthquake',
    type: 'earthquake',
    severity: 'critical',
    location: {
      lat: -6.2088,
      lng: 106.8456,
      name: 'Jakarta, Indonesia'
    },
    affectedPopulation: 30000000,
    dateTime: '2024-08-18T13:15:00Z',
    needs: [
      { id: 'as1-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 5000, quantityMatched: 3000, priority: 'high', source: 'BNPB Indonesia' },
      { id: 'as1-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 300000, quantityMatched: 120000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-asia-2',
    name: 'Chinese Flooding',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: 31.2304,
      lng: 121.4737,
      name: 'Shanghai, China'
    },
    affectedPopulation: 25000000,
    dateTime: '2024-08-19T10:30:00Z',
    needs: [
      { id: 'as2-1', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 100000, quantityMatched: 40000, priority: 'high', source: 'China Emergency Management' },
      { id: 'as2-2', category: 'Shelter', specificItem: 'Emergency Shelters', quantityRequested: 1000000, quantityMatched: 400000, priority: 'high', source: 'Red Cross China' }
    ]
  },
  {
    id: 'disaster-asia-3',
    name: 'Indian Earthquake',
    type: 'earthquake',
    severity: 'critical',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      name: 'Mumbai, India'
    },
    affectedPopulation: 20000000,
    dateTime: '2024-08-20T07:45:00Z',
    needs: [
      { id: 'as3-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 4000, quantityMatched: 2400, priority: 'high', source: 'NDRF India' },
      { id: 'as3-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 250000, quantityMatched: 100000, priority: 'high', source: 'WHO' }
    ]
  },
  // Additional Asian Disasters
  {
    id: 'disaster-asia-4',
    name: 'Vietnamese Flooding',
    type: 'flood',
    severity: 'high',
    location: {
      lat: 21.0285,
      lng: 105.8542,
      name: 'Hanoi, Vietnam'
    },
    affectedPopulation: 8000000,
    dateTime: '2024-08-21T12:00:00Z',
    needs: [
      { id: 'as4-1', category: 'Water', specificItem: 'Water Purification Tablets', quantityRequested: 300000, quantityMatched: 120000, priority: 'high', source: 'Vietnam Red Cross' },
      { id: 'as4-2', category: 'Medical', specificItem: 'Medical Emergency Kits', quantityRequested: 40000, quantityMatched: 16000, priority: 'high', source: 'WHO' }
    ]
  },
  {
    id: 'disaster-asia-5',
    name: 'Philippine Typhoon Maria',
    type: 'hurricane',
    severity: 'critical',
    location: {
      lat: 10.3157,
      lng: 123.8854,
      name: 'Cebu City, Philippines'
    },
    affectedPopulation: 3000000,
    dateTime: '2024-08-22T05:30:00Z',
    needs: [
      { id: 'as5-1', category: 'Shelter', specificItem: 'Emergency Tents', quantityRequested: 150000, quantityMatched: 60000, priority: 'high', source: 'NDRRMC Philippines' },
      { id: 'as5-2', category: 'Food', specificItem: 'Emergency Food Packs', quantityRequested: 800000, quantityMatched: 320000, priority: 'high', source: 'WFP' }
    ]
  },
  {
    id: 'disaster-oceania-1',
    name: 'Australian Bushfire Crisis',
    type: 'wildfire',
    severity: 'critical',
    location: {
      lat: -37.8136,
      lng: 144.9631,
      name: 'Melbourne, Australia'
    },
    affectedPopulation: 5000000,
    dateTime: '2024-08-23T14:20:00Z',
    needs: [
      { id: 'oc1-1', category: 'Firefighting', specificItem: 'Fire Suppression Equipment', quantityRequested: 8000, quantityMatched: 3200, priority: 'high', source: 'CFA Victoria' },
      { id: 'oc1-2', category: 'Medical', specificItem: 'Burn Treatment Kits', quantityRequested: 25000, quantityMatched: 10000, priority: 'high', source: 'Australian Red Cross' }
    ]
  },
  {
    id: 'disaster-oceania-2',
    name: 'New Zealand Earthquake',
    type: 'earthquake',
    severity: 'high',
    location: {
      lat: -36.8485,
      lng: 174.7633,
      name: 'Auckland, New Zealand'
    },
    affectedPopulation: 1600000,
    dateTime: '2024-08-24T09:15:00Z',
    needs: [
      { id: 'oc2-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 800, quantityMatched: 480, priority: 'high', source: 'NZFS' },
      { id: 'oc2-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 30000, quantityMatched: 12000, priority: 'high', source: 'WHO' }
    ]
  },
  // Additional European Disasters
  {
    id: 'disaster-europe-4',
    name: 'French Flooding',
    type: 'flood',
    severity: 'high',
    location: {
      lat: 48.8566,
      lng: 2.3522,
      name: 'Paris, France'
    },
    affectedPopulation: 12000000,
    dateTime: '2024-08-25T11:45:00Z',
    needs: [
      { id: 'eu4-1', category: 'Shelter', specificItem: 'Emergency Accommodations', quantityRequested: 600000, quantityMatched: 240000, priority: 'high', source: 'Sécurité Civile' },
      { id: 'eu4-2', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 15000, quantityMatched: 6000, priority: 'high', source: 'EU Emergency Response' }
    ]
  },
  {
    id: 'disaster-europe-5',
    name: 'UK Storm Emergency',
    type: 'hurricane',
    severity: 'high',
    location: {
      lat: 51.5074,
      lng: -0.1278,
      name: 'London, United Kingdom'
    },
    affectedPopulation: 9000000,
    dateTime: '2024-08-26T16:30:00Z',
    needs: [
      { id: 'eu5-1', category: 'Shelter', specificItem: 'Emergency Shelters', quantityRequested: 400000, quantityMatched: 160000, priority: 'high', source: 'UK Emergency Services' },
      { id: 'eu5-2', category: 'Medical', specificItem: 'Emergency Medical Kits', quantityRequested: 50000, quantityMatched: 20000, priority: 'high', source: 'NHS' }
    ]
  },
  // Additional African Disasters
  {
    id: 'disaster-africa-4',
    name: 'Kenyan Drought Crisis',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: -1.2921,
      lng: 36.8219,
      name: 'Nairobi, Kenya'
    },
    affectedPopulation: 15000000,
    dateTime: '2024-08-27T08:00:00Z',
    needs: [
      { id: 'af4-1', category: 'Water', specificItem: 'Emergency Water Supply', quantityRequested: 8000000, quantityMatched: 3200000, priority: 'high', source: 'UNICEF' },
      { id: 'af4-2', category: 'Food', specificItem: 'Emergency Food Rations', quantityRequested: 12000000, quantityMatched: 4800000, priority: 'high', source: 'WFP' }
    ]
  },
  {
    id: 'disaster-africa-5',
    name: 'Egyptian Earthquake',
    type: 'earthquake',
    severity: 'high',
    location: {
      lat: 30.0444,
      lng: 31.2357,
      name: 'Cairo, Egypt'
    },
    affectedPopulation: 20000000,
    dateTime: '2024-08-28T13:20:00Z',
    needs: [
      { id: 'af5-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 3500, quantityMatched: 2100, priority: 'high', source: 'Egyptian Civil Defense' },
      { id: 'af5-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 180000, quantityMatched: 72000, priority: 'high', source: 'WHO' }
    ]
  },
  // Additional North American Disasters  
  {
    id: 'disaster-north-america-8',
    name: 'Puerto Rican Hurricane',
    type: 'hurricane',
    severity: 'critical',
    location: {
      lat: 18.4655,
      lng: -66.1057,
      name: 'San Juan, Puerto Rico'
    },
    affectedPopulation: 3200000,
    dateTime: '2024-08-29T04:15:00Z',
    needs: [
      { id: 'na8-1', category: 'Water', specificItem: 'Emergency Water Supply', quantityRequested: 4000000, quantityMatched: 1600000, priority: 'high', source: 'FEMA' },
      { id: 'na8-2', category: 'Medical', specificItem: 'Medical Emergency Kits', quantityRequested: 80000, quantityMatched: 32000, priority: 'high', source: 'Red Cross' }
    ]
  },
  {
    id: 'disaster-north-america-9',
    name: 'Mexican Earthquake',
    type: 'earthquake',
    severity: 'critical',
    location: {
      lat: 19.4326,
      lng: -99.1332,
      name: 'Mexico City, Mexico'
    },
    affectedPopulation: 22000000,
    dateTime: '2024-08-30T17:40:00Z',
    needs: [
      { id: 'na9-1', category: 'Search and Rescue', specificItem: 'Search Equipment', quantityRequested: 5000, quantityMatched: 3000, priority: 'high', source: 'CENAPRED Mexico' },
      { id: 'na9-2', category: 'Medical', specificItem: 'Emergency Medical Supplies', quantityRequested: 300000, quantityMatched: 120000, priority: 'high', source: 'WHO' }
    ]
  },
  // Additional South American Disasters
  {
    id: 'disaster-south-america-5',
    name: 'Argentinian Flooding',
    type: 'flood',
    severity: 'high',
    location: {
      lat: -34.6118,
      lng: -58.3960,
      name: 'Buenos Aires, Argentina'
    },
    affectedPopulation: 15000000,
    dateTime: '2024-08-31T10:30:00Z',
    needs: [
      { id: 'sa5-1', category: 'Shelter', specificItem: 'Emergency Shelters', quantityRequested: 800000, quantityMatched: 320000, priority: 'high', source: 'Argentine Red Cross' },
      { id: 'sa5-2', category: 'Water', specificItem: 'Water Purification Systems', quantityRequested: 20000, quantityMatched: 8000, priority: 'high', source: 'UNICEF' }
    ]
  },
  {
    id: 'disaster-south-america-6',
    name: 'Venezuelan Crisis Emergency',
    type: 'flood',
    severity: 'critical',
    location: {
      lat: 10.4806,
      lng: -66.9036,
      name: 'Caracas, Venezuela'
    },
    affectedPopulation: 6000000,
    dateTime: '2024-09-01T15:00:00Z',
    needs: [
      { id: 'sa6-1', category: 'Food', specificItem: 'Emergency Food Rations', quantityRequested: 10000000, quantityMatched: 4000000, priority: 'high', source: 'WFP' },
      { id: 'sa6-2', category: 'Medical', specificItem: 'Medical Emergency Supplies', quantityRequested: 150000, quantityMatched: 60000, priority: 'high', source: 'WHO' }
    ]
  }
  // More disasters can be added as needed...
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
  },
  // Additional Strategic Global Centers
  {
    id: 'center-16',
    name: 'Hong Kong Distribution Hub',
    location: {
      lat: 22.3193,
      lng: 114.1694,
      name: 'Hong Kong'
    },
    inventoryStatus: 'ample',
    totalItems: 400000,
    totalCategories: 60,
    inventoryValue: 15000000,
    inventory: [
      {
        id: 'item-17',
        productType: 'Medical',
        specificItem: 'Emergency Medical Supplies',
        quantity: 25000,
        corporatePartner: 'Cathay Pacific',
        dateReceived: '2024-07-15',
        location: 'Warehouse Q',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-17',
    name: 'Amsterdam Logistics Center',
    location: {
      lat: 52.3676,
      lng: 4.9041,
      name: 'Amsterdam, Netherlands'
    },
    inventoryStatus: 'ample',
    totalItems: 350000,
    totalCategories: 55,
    inventoryValue: 12000000,
    inventory: [
      {
        id: 'item-18',
        productType: 'Water',
        specificItem: 'Water Purification Systems',
        quantity: 5000,
        corporatePartner: 'Royal Dutch Shell',
        dateReceived: '2024-07-12',
        location: 'Warehouse R',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-18',
    name: 'Lagos Distribution Center',
    location: {
      lat: 6.5244,
      lng: 3.3792,
      name: 'Lagos, Nigeria'
    },
    inventoryStatus: 'moderate',
    totalItems: 200000,
    totalCategories: 40,
    inventoryValue: 7000000,
    inventory: [
      {
        id: 'item-19',
        productType: 'Food',
        specificItem: 'Emergency Food Rations',
        quantity: 30000,
        corporatePartner: 'Dangote Group',
        dateReceived: '2024-07-10',
        location: 'Warehouse S',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-19',
    name: 'Delhi Regional Hub',
    location: {
      lat: 28.7041,
      lng: 77.1025,
      name: 'Delhi, India'
    },
    inventoryStatus: 'ample',
    totalItems: 380000,
    totalCategories: 58,
    inventoryValue: 11000000,
    inventory: [
      {
        id: 'item-20',
        productType: 'Shelter',
        specificItem: 'Emergency Tents',
        quantity: 15000,
        corporatePartner: 'Reliance Industries',
        dateReceived: '2024-07-14',
        location: 'Warehouse T',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-20',
    name: 'Bangkok Hub',
    location: {
      lat: 13.7563,
      lng: 100.5018,
      name: 'Bangkok, Thailand'
    },
    inventoryStatus: 'moderate',
    totalItems: 280000,
    totalCategories: 45,
    inventoryValue: 8500000,
    inventory: [
      {
        id: 'item-21',
        productType: 'Medical',
        specificItem: 'Medical Emergency Kits',
        quantity: 12000,
        corporatePartner: 'Thai Airways',
        dateReceived: '2024-07-11',
        location: 'Warehouse U',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-21',
    name: 'Cairo Distribution Center',
    location: {
      lat: 30.0444,
      lng: 31.2357,
      name: 'Cairo, Egypt'
    },
    inventoryStatus: 'moderate',
    totalItems: 250000,
    totalCategories: 42,
    inventoryValue: 8000000,
    inventory: [
      {
        id: 'item-22',
        productType: 'Water',
        specificItem: 'Water Containers',
        quantity: 20000,
        corporatePartner: 'Suez Canal Authority',
        dateReceived: '2024-07-09',
        location: 'Warehouse V',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-22',
    name: 'Buenos Aires Hub',
    location: {
      lat: -34.6118,
      lng: -58.3960,
      name: 'Buenos Aires, Argentina'
    },
    inventoryStatus: 'moderate',
    totalItems: 220000,
    totalCategories: 38,
    inventoryValue: 7500000,
    inventory: [
      {
        id: 'item-23',
        productType: 'Food',
        specificItem: 'Food Rations',
        quantity: 25000,
        corporatePartner: 'YPF',
        dateReceived: '2024-07-13',
        location: 'Warehouse W',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-23',
    name: 'Lima Distribution Center',
    location: {
      lat: -12.0464,
      lng: -77.0428,
      name: 'Lima, Peru'
    },
    inventoryStatus: 'moderate',
    totalItems: 180000,
    totalCategories: 35,
    inventoryValue: 6000000,
    inventory: [
      {
        id: 'item-24',
        productType: 'Medical',
        specificItem: 'First Aid Supplies',
        quantity: 8000,
        corporatePartner: 'LATAM Airlines',
        dateReceived: '2024-07-08',
        location: 'Warehouse X',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-24',
    name: 'Johannesburg Hub',
    location: {
      lat: -26.2041,
      lng: 28.0473,
      name: 'Johannesburg, South Africa'
    },
    inventoryStatus: 'ample',
    totalItems: 300000,
    totalCategories: 48,
    inventoryValue: 9500000,
    inventory: [
      {
        id: 'item-25',
        productType: 'Shelter',
        specificItem: 'Emergency Shelters',
        quantity: 10000,
        corporatePartner: 'Anglo American',
        dateReceived: '2024-07-12',
        location: 'Warehouse Y',
        condition: 'new'
      }
    ]
  },
  {
    id: 'center-25',
    name: 'Seoul Distribution Center',
    location: {
      lat: 37.5665,
      lng: 126.9780,
      name: 'Seoul, South Korea'
    },
    inventoryStatus: 'ample',
    totalItems: 360000,
    totalCategories: 52,
    inventoryValue: 13000000,
    inventory: [
      {
        id: 'item-26',
        productType: 'Medical',
        specificItem: 'Advanced Medical Kits',
        quantity: 18000,
        corporatePartner: 'Samsung',
        dateReceived: '2024-07-16',
        location: 'Warehouse Z',
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
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    relatedId: '1',
    relatedType: 'disaster',
    status: 'active'
  },
  {
    id: '2',
    type: 'urgent',
    message: 'Shipment ATB-789 to Miami Delayed by 12 hours - Road Closure.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
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
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
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
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 minutes ago
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
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'resolved'
  },
  {
    id: '6',
    type: 'info',
    message: 'Weekly Impact Report Generated.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    status: 'resolved'
  },
  {
    id: '7',
    type: 'info',
    message: 'Agentforce System Health: All systems operational.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
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
  },
  // Additional Routes for New Disasters and Centers
  {
    id: 'route-21',
    origin: {
      lat: 32.7767,
      lng: -96.7970,
      name: 'Dallas Distribution Center'
    },
    destination: {
      lat: 25.7617,
      lng: -80.1918,
      name: 'Miami, Florida, USA'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Water Supply', quantity: 200000, unit: 'liters' },
      { type: 'Medical Emergency Kits', quantity: 5000, unit: 'kits' }
    ],
    estimatedDuration: '18 hours',
    priority: 'critical'
  },
  {
    id: 'route-22',
    origin: {
      lat: 47.6062,
      lng: -122.3321,
      name: 'Seattle Warehouse'
    },
    destination: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Los Angeles, California, USA'
    },
    confirmed: true,
    resources: [
      { type: 'Fire Retardant', quantity: 1000, unit: 'units' },
      { type: 'Emergency Shelters', quantity: 20000, unit: 'units' }
    ],
    estimatedDuration: '14 hours',
    priority: 'critical'
  },
  {
    id: 'route-23',
    origin: {
      lat: 32.7767,
      lng: -96.7970,
      name: 'Dallas Distribution Center'
    },
    destination: {
      lat: 32.7555,
      lng: -97.3308,
      name: 'Fort Worth, Texas, USA'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Tents', quantity: 8000, unit: 'tents' },
      { type: 'Trauma Kits', quantity: 1500, unit: 'kits' }
    ],
    estimatedDuration: '2 hours',
    priority: 'high'
  },
  {
    id: 'route-24',
    origin: {
      lat: 47.6062,
      lng: -122.3321,
      name: 'Seattle Warehouse'
    },
    destination: {
      lat: 61.2181,
      lng: -149.9003,
      name: 'Anchorage, Alaska, USA'
    },
    confirmed: true,
    resources: [
      { type: 'Cold Weather Shelters', quantity: 2000, unit: 'units' },
      { type: 'Emergency Medical Supplies', quantity: 1000, unit: 'kits' }
    ],
    estimatedDuration: '8 hours',
    priority: 'high'
  },
  {
    id: 'route-25',
    origin: {
      lat: 43.6532,
      lng: -79.3832,
      name: 'Toronto Distribution Center'
    },
    destination: {
      lat: 49.2827,
      lng: -123.1207,
      name: 'Vancouver, British Columbia, Canada'
    },
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 200, unit: 'sets' },
      { type: 'Emergency Medical Supplies', quantity: 6000, unit: 'kits' }
    ],
    estimatedDuration: '36 hours',
    priority: 'high'
  },
  {
    id: 'route-26',
    origin: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'São Paulo Distribution Center'
    },
    destination: {
      lat: -3.1190,
      lng: -60.0217,
      name: 'Manaus, Brazil'
    },
    confirmed: true,
    resources: [
      { type: 'Water Purification Tablets', quantity: 20000, unit: 'tablets' },
      { type: 'Tropical Disease Kits', quantity: 2000, unit: 'kits' }
    ],
    estimatedDuration: '24 hours',
    priority: 'critical'
  },
  {
    id: 'route-27',
    origin: {
      lat: -12.0464,
      lng: -77.0428,
      name: 'Lima Distribution Center'
    },
    destination: {
      lat: -33.4489,
      lng: -70.6693,
      name: 'Santiago, Chile'
    },
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 300, unit: 'sets' },
      { type: 'Emergency Medical Supplies', quantity: 15000, unit: 'kits' }
    ],
    estimatedDuration: '16 hours',
    priority: 'critical'
  },
  {
    id: 'route-28',
    origin: {
      lat: 19.4326,
      lng: -99.1332,
      name: 'Mexico City Hub'
    },
    destination: {
      lat: 4.7110,
      lng: -74.0721,
      name: 'Bogotá, Colombia'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Shelters', quantity: 50000, unit: 'units' },
      { type: 'Clean Water Supply', quantity: 500000, unit: 'liters' }
    ],
    estimatedDuration: '20 hours',
    priority: 'high'
  },
  {
    id: 'route-29',
    origin: {
      lat: 50.1109,
      lng: 8.6821,
      name: 'Frankfurt Hub'
    },
    destination: {
      lat: 50.1109,
      lng: 8.6821,
      name: 'Frankfurt, Germany'
    },
    confirmed: true,
    resources: [
      { type: 'Water Purification Systems', quantity: 1000, unit: 'systems' },
      { type: 'Emergency Accommodations', quantity: 20000, unit: 'units' }
    ],
    estimatedDuration: '1 hour',
    priority: 'high'
  },
  {
    id: 'route-30',
    origin: {
      lat: 52.3676,
      lng: 4.9041,
      name: 'Amsterdam Logistics Center'
    },
    destination: {
      lat: 41.9028,
      lng: 12.4964,
      name: 'Rome, Italy'
    },
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 250, unit: 'sets' },
      { type: 'Medical Emergency Supplies', quantity: 10000, unit: 'kits' }
    ],
    estimatedDuration: '12 hours',
    priority: 'critical'
  },
  {
    id: 'route-31',
    origin: {
      lat: 6.5244,
      lng: 3.3792,
      name: 'Lagos Distribution Center'
    },
    destination: {
      lat: 6.5244,
      lng: 3.3792,
      name: 'Lagos, Nigeria'
    },
    confirmed: true,
    resources: [
      { type: 'Water Purification Systems', quantity: 5000, unit: 'systems' },
      { type: 'Waterborne Disease Kits', quantity: 8000, unit: 'kits' }
    ],
    estimatedDuration: '1 hour',
    priority: 'critical'
  },
  {
    id: 'route-32',
    origin: {
      lat: -26.2041,
      lng: 28.0473,
      name: 'Johannesburg Hub'
    },
    destination: {
      lat: -33.9249,
      lng: 18.4241,
      name: 'Cape Town, South Africa'
    },
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 150, unit: 'sets' },
      { type: 'Emergency Medical Supplies', quantity: 7000, unit: 'kits' }
    ],
    estimatedDuration: '14 hours',
    priority: 'high'
  },
  {
    id: 'route-33',
    origin: {
      lat: 30.0444,
      lng: 31.2357,
      name: 'Cairo Distribution Center'
    },
    destination: {
      lat: 9.1450,
      lng: 40.4897,
      name: 'Addis Ababa, Ethiopia'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Water Supply', quantity: 1000000, unit: 'liters' },
      { type: 'Emergency Food Rations', quantity: 1500000, unit: 'packages' }
    ],
    estimatedDuration: '18 hours',
    priority: 'critical'
  },
  {
    id: 'route-34',
    origin: {
      lat: 22.3193,
      lng: 114.1694,
      name: 'Hong Kong Distribution Hub'
    },
    destination: {
      lat: -6.2088,
      lng: 106.8456,
      name: 'Jakarta, Indonesia'
    },
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 500, unit: 'sets' },
      { type: 'Emergency Medical Supplies', quantity: 30000, unit: 'kits' }
    ],
    estimatedDuration: '16 hours',
    priority: 'critical'
  },
  {
    id: 'route-35',
    origin: {
      lat: 37.5665,
      lng: 126.9780,
      name: 'Seoul Distribution Center'
    },
    destination: {
      lat: 31.2304,
      lng: 121.4737,
      name: 'Shanghai, China'
    },
    confirmed: true,
    resources: [
      { type: 'Water Purification Systems', quantity: 10000, unit: 'systems' },
      { type: 'Emergency Shelters', quantity: 100000, unit: 'units' }
    ],
    estimatedDuration: '10 hours',
    priority: 'critical'
  },
  {
    id: 'route-36',
    origin: {
      lat: 28.7041,
      lng: 77.1025,
      name: 'Delhi Regional Hub'
    },
    destination: {
      lat: 19.0760,
      lng: 72.8777,
      name: 'Mumbai, India'
    },
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 400, unit: 'sets' },
      { type: 'Emergency Medical Supplies', quantity: 25000, unit: 'kits' }
    ],
    estimatedDuration: '14 hours',
    priority: 'critical'
  },
  {
    id: 'route-37',
    origin: {
      lat: 13.7563,
      lng: 100.5018,
      name: 'Bangkok Hub'
    },
    destination: {
      lat: 21.0285,
      lng: 105.8542,
      name: 'Hanoi, Vietnam'
    },
    confirmed: true,
    resources: [
      { type: 'Water Purification Tablets', quantity: 30000, unit: 'tablets' },
      { type: 'Medical Emergency Kits', quantity: 4000, unit: 'kits' }
    ],
    estimatedDuration: '8 hours',
    priority: 'high'
  },
  {
    id: 'route-38',
    origin: {
      lat: 22.3193,
      lng: 114.1694,
      name: 'Hong Kong Distribution Hub'
    },
    destination: {
      lat: 10.3157,
      lng: 123.8854,
      name: 'Cebu City, Philippines'
    },
    confirmed: true,
    resources: [
      { type: 'Emergency Tents', quantity: 15000, unit: 'tents' },
      { type: 'Emergency Food Packs', quantity: 80000, unit: 'packs' }
    ],
    estimatedDuration: '12 hours',
    priority: 'critical'
  },
  {
    id: 'route-39',
    origin: {
      lat: -33.8688,
      lng: 151.2093,
      name: 'Sydney Hub'
    },
    destination: {
      lat: -37.8136,
      lng: 144.9631,
      name: 'Melbourne, Australia'
    },
    confirmed: true,
    resources: [
      { type: 'Fire Suppression Equipment', quantity: 800, unit: 'units' },
      { type: 'Burn Treatment Kits', quantity: 2500, unit: 'kits' }
    ],
    estimatedDuration: '8 hours',
    priority: 'critical'
  },
  {
    id: 'route-40',
    origin: {
      lat: -33.8688,
      lng: 151.2093,
      name: 'Sydney Hub'
    },
    destination: {
      lat: -36.8485,
      lng: 174.7633,
      name: 'Auckland, New Zealand'
    },
    confirmed: true,
    resources: [
      { type: 'Search Equipment', quantity: 80, unit: 'sets' },
      { type: 'Emergency Medical Supplies', quantity: 3000, unit: 'kits' }
    ],
    estimatedDuration: '4 hours',
    priority: 'high'
  }
];