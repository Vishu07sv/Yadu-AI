// API service layer for Yadu AI.
//
// Every function here currently resolves with mock data after a small
// simulated delay. Each function is documented with the real REST endpoint
// it should call once a backend is available — swap the body of the
// function and the rest of the app (components, pages) requires no changes,
// since they only ever import from this file.

import {
  mockFarmer,
  mockWeather,
  mockSoil,
  mockCrops,
  mockMarketPrices,
  mockCropAnalysis,
  chatResponses,
  defaultChatReply,
  mockNotifications,
} from '../data/mockData'

const DELAY_MS = 650

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Toggle to simulate a network/server failure from any screen for testing
// error states. Left off by default.
const SIMULATE_ERRORS = false

async function resolveOrReject(payload, { errorMessage } = {}) {
  await delay()
  if (SIMULATE_ERRORS && Math.random() < 0.15) {
    throw new Error(errorMessage || 'Something went wrong. Please try again.')
  }
  return payload
}

/** GET /api/weather?location= */
export async function getWeather() {
  return resolveOrReject(mockWeather, {
    errorMessage: "We couldn't load the weather information. Please try again.",
  })
}

/** GET /api/soil?farmId= */
export async function getSoilData() {
  return resolveOrReject(mockSoil, {
    errorMessage: "We couldn't load your soil information. Please try again.",
  })
}

/** GET /api/crops?farmerId= */
export async function getCrops() {
  return resolveOrReject(mockCrops, {
    errorMessage: "We couldn't load your crops. Please try again.",
  })
}

/** GET /api/crops/:id */
export async function getCropById(id) {
  await delay(300)
  return mockCrops.find((c) => c.id === id) || null
}

/** POST /api/crops */
export async function addCrop(newCrop) {
  await delay(500)
  const crop = {
    id: `crop_${Date.now()}`,
    health: 'healthy',
    healthScore: 75,
    healthHistory: [{ day: 'Wk 1', score: 75 }],
    risks: [],
    recommendations: ['Keep monitoring soil moisture for the first two weeks after planting.'],
    ...newCrop,
  }
  mockCrops.unshift(crop)
  return crop
}

/** GET /api/market-prices?location= */
export async function getMarketPrices() {
  return resolveOrReject(mockMarketPrices, {
    errorMessage: "We couldn't load market prices. Please try again.",
  })
}

/** POST /api/analyze-crop  (multipart form with image) */
export async function analyzeCrop(_imageFile) {
  await delay(1800)
  return mockCropAnalysis
}

/** POST /api/chat  { message } */
export async function sendChatMessage(message) {
  await delay(900)
  const lower = message.toLowerCase()
  const match = chatResponses.find((r) => r.keywords.some((k) => lower.includes(k)))
  return {
    id: `ai_${Date.now()}`,
    sender: 'ai',
    text: match ? match.reply : defaultChatReply,
    time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
  }
}

/** GET /api/profile */
export async function getFarmerProfile() {
  return resolveOrReject(mockFarmer, {
    errorMessage: "We couldn't load your profile. Please try again.",
  })
}

/** PATCH /api/profile */
export async function updateFarmerProfile(updates) {
  await delay(500)
  Object.assign(mockFarmer, updates)
  return mockFarmer
}

/** GET /api/notifications */
export async function getNotifications() {
  await delay(300)
  return mockNotifications
}

/** POST /api/auth/login  { mobile, password } */
export async function loginFarmer(_credentials) {
  await delay(700)
  return { token: 'mock-token', farmer: mockFarmer }
}

/** POST /api/auth/register  { ...registration fields } */
export async function registerFarmer(fields) {
  await delay(900)
  Object.assign(mockFarmer, {
    fullName: fields.fullName || mockFarmer.fullName,
    mobile: fields.mobile || mockFarmer.mobile,
    state: fields.state || mockFarmer.state,
    district: fields.district || mockFarmer.district,
    village: fields.village || mockFarmer.village,
    farmArea: fields.farmArea || mockFarmer.farmArea,
    mainCrop: fields.mainCrop || mockFarmer.mainCrop,
    location: `${fields.district || mockFarmer.district}, ${fields.state || mockFarmer.state}`,
  })
  return { token: 'mock-token', farmer: mockFarmer }
}

/** GET reverse-geocode for "use my current location" */
export async function detectLocation() {
  await delay(900)
  return { state: 'Chhattisgarh', district: 'Raipur', village: 'Kharora' }
}


/**
 * POST /predict-crop
 * Calls the YADU AI Python ML backend.
 */
export async function predictCrop(input) {
  const response = await fetch(
    'http://127.0.0.1:8000/predict-crop',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        N: Number(input.N),
        P: Number(input.P),
        K: Number(input.K),
        temperature: Number(input.temperature),
        humidity: Number(input.humidity),
        ph: Number(input.ph),
        rainfall: Number(input.rainfall),
      }),
    }
  )

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Crop prediction failed: ${message}`)
  }

  return response.json()
}

/**
 * GET /weather-by-location?village=
 * Fetches real weather data from the YADU AI Python backend.
 */
export async function getWeatherByLocation(village) {
  const response = await fetch(
    `http://127.0.0.1:8000/weather-by-location?village=${encodeURIComponent(village)}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Could not fetch weather for this location.'
    )
  }

  // The backend returns candidates when the district filter
  // cannot find an exact match.
  if (data.candidates) {
    throw new Error(
      `Location needs verification. Try another name or check the district.`
    )
  }

  return data
}

/**
 * POST /farm-economics/compare
 * Compares crop costs, revenue, and estimated profit.
 */
export async function compareFarmEconomics(input) {
  const response = await fetch(
    'http://127.0.0.1:8000/farm-economics/compare',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail
        ? JSON.stringify(data.detail)
        : 'Could not calculate farm economics.'
    )
  }

  return data
}


