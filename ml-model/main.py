
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import date, timedelta
from farm_economics import router as farm_economics_router


# --------------------------------------------------
# 1. Paths and model loading
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "crop_model.pkl"

model = joblib.load(MODEL_PATH)

app = FastAPI(title="YADU AI Crop Recommendation API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.include_router(farm_economics_router)

# --------------------------------------------------
# 2. Crop prediction input validation
# --------------------------------------------------

class CropInput(BaseModel):
    N: float = Field(ge=0, le=300)
    P: float = Field(ge=0, le=300)
    K: float = Field(ge=0, le=300)
    temperature: float = Field(ge=-10, le=60)
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0, le=5000)


# --------------------------------------------------
# 3. API health check
# --------------------------------------------------

@app.get("/")
def home():
    return {"message": "YADU AI API is running"}


# --------------------------------------------------
# 4. Predict the recommended crop
# --------------------------------------------------


@app.post("/predict-crop")
def predict_crop(data: CropInput):
    input_data = pd.DataFrame([data.model_dump()])

    probabilities = model.predict_proba(input_data)[0]
    crop_names = model.classes_

    ranked = sorted(
        zip(crop_names, probabilities),
        key=lambda item: item[1],
        reverse=True,
    )

    recommendations = [
        {
            "crop": str(crop),
            "percentage": round(float(probability) * 100, 2),
        }
        for crop, probability in ranked[:5]
    ]

    return {
        "recommended_crop": recommendations[0]["crop"],
        "recommendations": recommendations,
    }


# --------------------------------------------------
# 5. Find weather by village name
# --------------------------------------------------

@app.get("/weather-by-location")
def weather_by_location(village: str):
    # Step 1: Search for the village or location
    try:
        geo_response = requests.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={
                "name": village,
                "count": 10,
                "language": "en",
                "format": "json",
            },
            timeout=15,
        )
        geo_response.raise_for_status()
        geo_data = geo_response.json()

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not reach the location service.",
        ) from exc

    candidates = geo_data.get("results", [])

    if not candidates:
        raise HTTPException(
            status_code=404,
            detail="No locations found for this search term.",
        )

# --------------------------------------------------
# 6. Automatic seasonal rainfall analysis
# --------------------------------------------------

@app.get("/seasonal-rainfall")
def seasonal_rainfall(village: str):
    today = date.today()

    # Automatically identify the current season.
    if today.month in (6, 7, 8, 9, 10):
        season = "Kharif"
        start_year = today.year
        season_start = date(today.year, 6, 1)
        season_end = date(today.year, 10, 31)

    elif today.month in (11, 12, 1, 2, 3):
        season = "Rabi"
        start_year = today.year if today.month >= 11 else today.year - 1
        season_start = date(start_year, 11, 1)
        season_end = date(start_year + 1, 3, 31)

    else:
        season = "Zaid"
        start_year = today.year
        season_start = date(today.year, 4, 1)
        season_end = date(today.year, 5, 31)

    # Find the location using the existing geocoding service.
    try:
        geo_response = requests.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={
                "name": village,
                "count": 10,
                "language": "en",
                "format": "json",
            },
            timeout=15,
        )
        geo_response.raise_for_status()
        candidates = geo_response.json().get("results", [])

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not reach the location service.",
        ) from exc

    def normalize(value):
        return str(value or "").strip().casefold()

    matches = [
        place for place in candidates
        if normalize(place.get("country_code")) == "in"
        and normalize(place.get("admin1")) == "chhattisgarh"
        and normalize(place.get("admin2")) in {
            "raipur", "raipur district"
        }
    ]

    if not matches:
        raise HTTPException(
            status_code=404,
            detail="No matching location found in Raipur district, Chhattisgarh.",
        )

    place = matches[0]
    latitude = place["latitude"]
    longitude = place["longitude"]

    # Historical rainfall: from season start through yesterday.
    historical_rainfall_mm = None
    historical_period = None

    historical_end = min(
        today - timedelta(days=1),
        season_end,
    )

    if season_start <= historical_end:
        try:
            history_response = requests.get(
                "https://archive-api.open-meteo.com/v1/archive",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "start_date": season_start.isoformat(),
                    "end_date": historical_end.isoformat(),
                    "daily": "precipitation_sum",
                    "timezone": "Asia/Kolkata",
                },
                timeout=30,
            )
            history_response.raise_for_status()
            history_data = history_response.json()

            values = history_data.get("daily", {}).get(
                "precipitation_sum", []
            )
            valid_values = [v for v in values if v is not None]

            historical_rainfall_mm = round(sum(valid_values), 1)
            historical_period = {
                "start": season_start.isoformat(),
                "end": historical_end.isoformat(),
            }

        except requests.RequestException:
            historical_rainfall_mm = None

    # Seasonal model outlook: estimate rainfall for the remaining season.
    forecast_rainfall_mm = None
    forecast_period = None
    forecast_note = None

    forecast_start = max(today, season_start)

    if forecast_start <= season_end:
        try:
            forecast_response = requests.get(
                "https://seasonal-api.open-meteo.com/v1/seasonal",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "daily": "precipitation_sum",
                    "forecast_days": 183,
                    "timezone": "Asia/Kolkata",
                },
                timeout=30,
            )
            forecast_response.raise_for_status()
            forecast_data = forecast_response.json()
            daily = forecast_data.get("daily", {})

            dates = daily.get("time", [])
            values = daily.get("precipitation_sum", [])

            selected_values = [
                value
                for forecast_date, value in zip(dates, values)
                if forecast_date >= forecast_start.isoformat()
                and forecast_date <= season_end.isoformat()
                and value is not None
            ]

            if selected_values:
                forecast_rainfall_mm = round(
                    sum(selected_values), 1
                )
                forecast_period = {
                    "start": forecast_start.isoformat(),
                    "end": season_end.isoformat(),
                }
            else:
                forecast_note = (
                    "The seasonal forecast did not return usable "
                    "daily rainfall values for the remaining season."
                )

        except (requests.RequestException, ValueError):
            forecast_note = (
                "Seasonal forecast data is temporarily unavailable."
            )

    # Estimate total seasonal rainfall only when both parts are available.
    estimated_season_total_mm = None

    if historical_rainfall_mm is not None and forecast_rainfall_mm is not None:
        estimated_season_total_mm = round(
            historical_rainfall_mm + forecast_rainfall_mm, 1
        )

    return {
        "location": {
            "village": place.get("name"),
            "district": place.get("admin2"),
            "state": place.get("admin1"),
            "latitude": latitude,
            "longitude": longitude,
        },
        "season": {
            "name": season,
            "start": season_start.isoformat(),
            "end": season_end.isoformat(),
            "detected_from_date": today.isoformat(),
        },
        "rainfall": {
            "historical_rainfall_mm": historical_rainfall_mm,
            "historical_period": historical_period,
            "expected_remaining_rainfall_mm": forecast_rainfall_mm,
            "forecast_period": forecast_period,
            "estimated_season_total_mm": estimated_season_total_mm,
        },
        "sources": {
            "historical": "Open-Meteo Historical Weather API",
            "forecast": "Open-Meteo Seasonal Forecast API",
        },
        "note": (
            "Season dates are approximate planning windows. "
            "Seasonal forecasts are uncertain and may be unavailable. "
            "The estimated total combines observed/reanalysis rainfall "
            "so far with forecast rainfall for the remaining period; "
            "it is not a guarantee of actual seasonal rainfall."
        ),
        "forecast_status": forecast_note,
    }

    # Step 2: Filter for India, Chhattisgarh, Raipur district.
    # Compare case-insensitively and tolerate whitespace.
    def normalize(value):
        return str(value or "").strip().casefold()

    matches = [
        place
        for place in candidates
        if normalize(place.get("country_code")) == "in"
        and normalize(place.get("admin1")) == "chhattisgarh"
        and normalize(place.get("admin2")) in {
            "raipur",
            "raipur district",
        }
    ]

    # If no exact match exists, return candidates for diagnosis.
    # This helps identify how Open-Meteo labels the district.
    if not matches:
        return {
            "message": (
                "Locations were found, but none matched "
                "Raipur district, Chhattisgarh. Check the candidates."
            ),
            "search_term": village,
            "candidates": [
                {
                    "name": place.get("name"),
                    "country": place.get("country"),
                    "country_code": place.get("country_code"),
                    "state": place.get("admin1"),
                    "district": place.get("admin2"),
                    "latitude": place.get("latitude"),
                    "longitude": place.get("longitude"),
                }
                for place in candidates
            ],
        }

    # Step 3: Select the first matching result
    place = matches[0]
    latitude = place["latitude"]
    longitude = place["longitude"]

    # Step 4: Fetch current weather and a 7-day rainfall forecast
    try:
        weather_response = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": (
                    "temperature_2m,"
                    "relative_humidity_2m,"
                    "precipitation"
                ),
                "daily": "precipitation_sum",
                "forecast_days": 7,
                "timezone": "Asia/Kolkata",
            },
            timeout=15,
        )
        weather_response.raise_for_status()
        weather_data = weather_response.json()

    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not retrieve weather data.",
        ) from exc

    current = weather_data.get("current", {})
    daily = weather_data.get("daily", {})

    # Step 5: Return the response
    return {
        "location": {
            "village": place.get("name"),
            "district": place.get("admin2"),
            "state": place.get("admin1"),
            "country": place.get("country"),
            "latitude": latitude,
            "longitude": longitude,
        },
        "weather": {
            "temperature_c": current.get("temperature_2m"),
            "humidity_percent": current.get(
                "relative_humidity_2m"
            ),
            "current_precipitation_mm": current.get(
                "precipitation"
            ),
            "forecast_dates": daily.get("time", []),
            "forecast_rainfall_mm": daily.get(
                "precipitation_sum", []
            ),
        },
        "source": "Open-Meteo",
        "note": (
            "Weather data does not provide soil nitrogen (N), "
            "phosphorus (P), potassium (K), or pH. "
            "These values still need a separate soil data source "
            "or user input for the current crop prediction model. "
            "The 7-day rainfall forecast is not automatically "
            "equivalent to the rainfall feature used during training."
        ),
    }
