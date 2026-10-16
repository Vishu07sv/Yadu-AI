// Centralized mock data for Yadu AI.
// This is the ONLY place mock data should live — components and services
// should import from here rather than hardcoding values.

export const mockFarmer = {
  id: 'farmer_001',
  fullName: 'Ramesh Verma',
  mobile: '+91 98765 43210',
  state: 'Chhattisgarh',
  district: 'Raipur',
  village: 'Kharora',
  location: 'Raipur, Chhattisgarh',
  farmArea: 4.0,
  farmAreaUnit: 'acres',
  mainCrop: 'Rice',
  joinedDate: '2025-03-14',
  avatarInitials: 'RV',
}

export const mockWeather = {
  location: 'Raipur, Chhattisgarh',
  temperature: 29,
  condition: 'Partly Cloudy',
  humidity: 72,
  windSpeed: 12,
  rainProbability: 20,
  feelsLike: 32,
  uvIndex: 6,
  updatedAt: '2026-08-14T07:30:00+05:30',
  hourly: [
    { time: '6 AM', temp: 24, condition: 'clear' },
    { time: '9 AM', temp: 27, condition: 'cloudy' },
    { time: '12 PM', temp: 30, condition: 'cloudy' },
    { time: '3 PM', temp: 29, condition: 'rain' },
    { time: '6 PM', temp: 27, condition: 'cloudy' },
    { time: '9 PM', temp: 25, condition: 'clear' },
  ],
  forecast: [
    { day: 'Today', high: 29, low: 23, condition: 'cloudy', rain: 20 },
    { day: 'Tomorrow', high: 30, low: 24, condition: 'rain', rain: 65 },
    { day: 'Sun', high: 28, low: 23, condition: 'rain', rain: 70 },
    { day: 'Mon', high: 31, low: 24, condition: 'clear', rain: 10 },
    { day: 'Tue', high: 32, low: 25, condition: 'clear', rain: 5 },
  ],
  farmImpact:
    'Rain probability rises sharply from tomorrow. Delay any planned irrigation and check field drainage before the weekend showers arrive.',
}

export const mockSoil = {
  soilType: 'Loamy',
  ph: 6.7,
  nitrogen: { level: 'Normal', value: 62 },
  phosphorus: { level: 'Low', value: 28 },
  potassium: { level: 'Good', value: 78 },
  moisture: 58,
  organicMatter: 3.2,
  healthScore: 74,
  recommendation:
    'Phosphorus level appears slightly low. Consider adding an appropriate phosphorus-rich fertilizer after consulting local agricultural guidance.',
  isMockData: true,
}

export const mockCrops = [
  {
    id: 'crop_001',
    name: 'Rice',
    variety: 'IR-64',
    area: 2.5,
    areaUnit: 'acres',
    plantedDate: '2026-07-20',
    growthStage: 'Vegetative',
    health: 'healthy',
    healthScore: 82,
    irrigation: 'Flood irrigation',
    soilType: 'Loamy',
    waterRequirement: 'Moderate — 5-6 cm standing water',
    weatherImpact: 'Upcoming rain will reduce irrigation need for 3-4 days.',
    risks: ['Stem borer activity typical this season', 'Waterlogging if rains persist beyond 3 days'],
    recommendations: [
      'Maintain 5 cm standing water through the vegetative stage',
      'Scout for stem borer damage weekly',
      'Apply top-dressing of nitrogen after this rain event',
    ],
    healthHistory: [
      { day: 'Wk 1', score: 88 },
      { day: 'Wk 2', score: 85 },
      { day: 'Wk 3', score: 80 },
      { day: 'Wk 4', score: 82 },
    ],
    notes: 'Second season on this plot. Used certified seed.',
  },
  {
    id: 'crop_002',
    name: 'Wheat',
    variety: 'HD-2967',
    area: 1.5,
    areaUnit: 'acres',
    plantedDate: '2026-06-05',
    growthStage: 'Tillering',
    health: 'attention',
    healthScore: 61,
    irrigation: 'Sprinkler',
    soilType: 'Clay loam',
    waterRequirement: 'Low — irrigate only if topsoil is dry',
    weatherImpact: 'High humidity increases risk of leaf rust this week.',
    risks: ['Leaf rust due to sustained humidity', 'Nutrient stress — yellowing in lower leaves'],
    recommendations: [
      'Inspect lower leaves for rust pustules',
      'Improve field drainage to reduce humidity buildup',
      'Consider a foliar micronutrient spray',
    ],
    healthHistory: [
      { day: 'Wk 1', score: 76 },
      { day: 'Wk 2', score: 70 },
      { day: 'Wk 3', score: 64 },
      { day: 'Wk 4', score: 61 },
    ],
    notes: 'Leaves showing mild yellowing since last week.',
  },
  {
    id: 'crop_003',
    name: 'Soybean',
    variety: 'JS-335',
    area: 1.0,
    areaUnit: 'acre',
    plantedDate: '2026-07-02',
    growthStage: 'Flowering',
    health: 'healthy',
    healthScore: 90,
    irrigation: 'Rainfed',
    soilType: 'Loamy',
    waterRequirement: 'Adequate from recent rainfall',
    weatherImpact: 'Favourable conditions for pod development this week.',
    risks: ['Pod borer emergence typical at flowering stage'],
    recommendations: ['Monitor for pod borer', 'Avoid nitrogen-heavy fertilizer at this stage'],
    healthHistory: [
      { day: 'Wk 1', score: 84 },
      { day: 'Wk 2', score: 87 },
      { day: 'Wk 3', score: 89 },
      { day: 'Wk 4', score: 90 },
    ],
    notes: '',
  },
]

export const mockMarketPrices = [
  {
    id: 'mkt_rice',
    crop: 'Rice',
    variety: 'Common',
    market: 'Raipur Mandi',
    price: 2450,
    previousPrice: 2374,
    unit: 'quintal',
    trend: [2280, 2310, 2350, 2374, 2410, 2450],
  },
  {
    id: 'mkt_wheat',
    crop: 'Wheat',
    variety: 'HD-2967',
    market: 'Raipur Mandi',
    price: 2180,
    previousPrice: 2205,
    unit: 'quintal',
    trend: [2260, 2240, 2230, 2205, 2195, 2180],
  },
  {
    id: 'mkt_soybean',
    crop: 'Soybean',
    variety: 'Yellow',
    market: 'Durg Mandi',
    price: 4620,
    previousPrice: 4450,
    unit: 'quintal',
    trend: [4210, 4280, 4340, 4450, 4520, 4620],
  },
  {
    id: 'mkt_maize',
    crop: 'Maize',
    variety: 'Hybrid',
    market: 'Raipur Mandi',
    price: 2015,
    previousPrice: 2040,
    unit: 'quintal',
    trend: [2080, 2070, 2055, 2040, 2030, 2015],
  },
  {
    id: 'mkt_tomato',
    crop: 'Tomato',
    variety: 'Local',
    market: 'Raipur Mandi',
    price: 1320,
    previousPrice: 1150,
    unit: 'quintal',
    trend: [980, 1040, 1090, 1150, 1240, 1320],
  },
  {
    id: 'mkt_potato',
    crop: 'Potato',
    variety: 'Jyoti',
    market: 'Bilaspur Mandi',
    price: 1180,
    previousPrice: 1205,
    unit: 'quintal',
    trend: [1260, 1245, 1220, 1205, 1195, 1180],
  },
]

export const mockCropAnalysis = {
  crop: 'Tomato',
  health: 'Moderate Risk',
  disease: 'Early Blight',
  confidence: 92,
  causes: ['Excess moisture', 'Fungal infection', 'Poor air circulation'],
  actions: [
    'Remove infected leaves',
    'Avoid overhead irrigation',
    'Monitor surrounding plants',
    'Consult a local agricultural expert if symptoms worsen',
  ],
}

export const mockChatHistory = [
  {
    id: 'm1',
    sender: 'farmer',
    text: 'My rice leaves are turning yellow. What should I do?',
    time: '9:02 AM',
  },
  {
    id: 'm2',
    sender: 'ai',
    text:
      "Yellowing leaves can have several causes, including nutrient deficiency, water stress or disease. Based on your current farm conditions, let's check your soil and recent weather first.",
    time: '9:02 AM',
  },
]

export const quickQuestions = [
  'Why are my leaves yellow?',
  'When should I water my crop?',
  'What fertilizer should I use?',
  "What is today's weather?",
  'What is the current crop price?',
]

// Simple canned-response engine for the mock chatbot service.
export const chatResponses = [
  {
    keywords: ['yellow', 'yellowing'],
    reply:
      "Yellowing leaves usually point to nitrogen deficiency, overwatering, or early disease. Your soil nitrogen is currently normal, so I'd check drainage first — standing water for too long can cause this. If it continues past a few days, a light nitrogen top-dressing usually helps.",
  },
  {
    keywords: ['water', 'irrigat'],
    reply:
      "Based on today's soil moisture (58%) and the rain expected tomorrow, you can hold off on irrigation for now. I'll notify you if conditions change.",
  },
  {
    keywords: ['fertiliz', 'fertiliser', 'nutrient'],
    reply:
      'Your soil shows low phosphorus and normal nitrogen. A phosphorus-rich fertilizer would help right now — but it\'s best to confirm the exact dose with your local agriculture office based on a fresh soil test.',
  },
  {
    keywords: ['weather', 'rain', 'temperature'],
    reply:
      "It's 29°C and partly cloudy in Raipur right now, with 72% humidity and a 20% chance of rain today. Rain probability rises to 65% tomorrow, so plan field work accordingly.",
  },
  {
    keywords: ['price', 'mandi', 'market', 'rate'],
    reply:
      'Rice is currently trading at ₹2,450/quintal at Raipur Mandi, up 3.2% from last week. Soybean has moved up the most this week — currently ₹4,620/quintal at Durg Mandi.',
  },
  {
    keywords: ['disease', 'blight', 'pest', 'insect'],
    reply:
      "If you're seeing spots or wilting, a clear close-up photo will help a lot — you can upload one in AI Crop Doctor and I'll analyze it for likely disease and next steps.",
  },
]

export const defaultChatReply =
  "I can help with that. Could you tell me a bit more — which crop, and what you're noticing in the field? You can also upload a photo in AI Crop Doctor for a visual analysis."

export const mockNotifications = [
  {
    id: 'n1',
    icon: '🌧',
    text: 'Rain expected tomorrow — 65% chance in Raipur',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    icon: '🌾',
    text: 'Wheat crop needs attention — leaf rust risk rising',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'n3',
    icon: '💰',
    text: 'Rice prices increased 3.2% today at Raipur Mandi',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'n4',
    icon: '💧',
    text: 'Soil moisture is decreasing — currently at 58%',
    time: '1 day ago',
    read: true,
  },
]

export const statesAndDistricts = {
  Chhattisgarh: ['Raipur', 'Durg', 'Bilaspur', 'Bastar', 'Rajnandgaon'],
  Maharashtra: ['Nagpur', 'Pune', 'Nashik', 'Amravati', 'Aurangabad'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Kanpur', 'Meerut'],
  Punjab: ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'],
}

export const cropOptions = [
  'Rice', 'Wheat', 'Soybean', 'Maize', 'Tomato', 'Potato', 'Cotton', 'Sugarcane', 'Gram', 'Mustard',
]
