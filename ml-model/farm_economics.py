
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/farm-economics", tags=["Farm Economics"])


class ExpenseItem(BaseModel):
    name: str
    cost_per_acre: float = Field(ge=0)
    upfront_fraction: float = Field(default=0.5, ge=0, le=1)


class CropAssumption(BaseModel):
    crop: str
    yield_quintals_per_acre: float = Field(gt=0)
    price_per_quintal: float = Field(gt=0)
    expenses: list[ExpenseItem]
    # Scenario multipliers are editable assumptions, not model predictions.
    low_yield_factor: float = Field(default=0.8, gt=0, le=1)
    high_yield_factor: float = Field(default=1.2, ge=1)
    low_price_factor: float = Field(default=0.9, gt=0, le=1)
    high_price_factor: float = Field(default=1.1, ge=1)
    low_cost_factor: float = Field(default=1.1, ge=1)
    high_cost_factor: float = Field(default=0.95, gt=0, le=1)


class EconomicsRequest(BaseModel):
    area_acres: float = Field(default=2, gt=0, le=10000)
    crops: list[CropAssumption] = Field(min_length=1, max_length=20)


def calculate_crop(crop: CropAssumption, area: float) -> dict:
    seasonal_cost = sum(item.cost_per_acre for item in crop.expenses) * area

    initial_capital = sum(
        item.cost_per_acre * item.upfront_fraction
        for item in crop.expenses
    ) * area

    base_yield = crop.yield_quintals_per_acre * area
    base_revenue = base_yield * crop.price_per_quintal

    def scenario(yield_factor: float, price_factor: float,
                 cost_factor: float) -> dict:
        production = base_yield * yield_factor
        revenue = production * crop.price_per_quintal * price_factor
        cost = seasonal_cost * cost_factor

        return {
            "production_quintals": round(production, 2),
            "revenue_inr": round(revenue, 2),
            "total_cost_inr": round(cost, 2),
            "net_profit_inr": round(revenue - cost, 2),
        }

    expense_breakdown = [
        {
            "name": item.name,
            "cost_inr": round(item.cost_per_acre * area, 2),
            "initial_capital_inr": round(
                item.cost_per_acre * item.upfront_fraction * area, 2
            ),
        }
        for item in crop.expenses
    ]

    return {
        "crop": crop.crop,
        "area_acres": area,
        "assumptions": {
            "yield_quintals_per_acre": crop.yield_quintals_per_acre,
            "selling_price_per_quintal_inr": crop.price_per_quintal,
            "assumption_source": "User-entered; verify locally before use",
        },
        "initial_capital_inr": round(initial_capital, 2),
        "seasonal_cost_inr": round(seasonal_cost, 2),
        "expense_breakdown": expense_breakdown,
        "break_even_price_per_quintal_inr": round(
            seasonal_cost / base_yield, 2
        ),
        "scenarios": {
            "low": scenario(
                crop.low_yield_factor,
                crop.low_price_factor,
                crop.low_cost_factor,
            ),
            "base": scenario(1.0, 1.0, 1.0),
            "high": scenario(
                crop.high_yield_factor,
                crop.high_price_factor,
                crop.high_cost_factor,
            ),
        },
    }


@router.post("/compare")
def compare_crops(request: EconomicsRequest):
    names = [crop.crop.strip().lower() for crop in request.crops]

    if any(not name for name in names):
        raise HTTPException(status_code=422, detail="Crop names cannot be empty.")

    if len(set(names)) != len(names):
        raise HTTPException(
            status_code=422,
            detail="Please provide each crop only once.",
        )

    results = [calculate_crop(crop, request.area_acres) for crop in request.crops]

    return {
        "area_acres": request.area_acres,
        "currency": "INR",
        "results": sorted(
            results,
            key=lambda result: result["scenarios"]["base"]["net_profit_inr"],
            reverse=True,
        ),
        "disclaimer": (
            "Estimates depend on user-entered costs, yield and selling prices. "
            "They are not guaranteed returns or verified live market quotes."
        ),
    }
