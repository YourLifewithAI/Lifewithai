"""Transparent scenario arithmetic; not a structural or utility design.

Run: python arcology-scale-model.py
Writes arcology-scale-results.json beside this script.
Population targets reflect the author's September 25, 2026 clarification.
Geometry is the legacy square-tier research approximation, not the illustration.
The public flat summit and variable main-mass tier count are confirmed directions.
The housing-led case leads the next massing study; the larger shared-city case
is the comparison. Equivalent widths below remain legacy-geometry comparisons.
"""
import json
import math
from pathlib import Path

HUMANS = 100_000_000
PAIRED_AI = 100_000_000
PRIVATE_HOME_SQFT_PER_HUMAN = 750
SQFT_TO_M2 = 0.09290304
GROSS_SQFT = 79.7e9  # Published rounded total, retained for comparison.
USABLE_SQFT = 55.8e9  # Published rounded total.
GROSS_M2 = GROSS_SQFT * SQFT_TO_M2
USABLE_M2 = USABLE_SQFT * SQFT_TO_M2

results = {
    "status": "concept-stage sensitivity calculations, not validated design",
    "confirmed_design_direction": {
        "summit": "large flat public space, open to everyone regardless of wealth or residential address",
        "main_mass_tier_count": "variable with physical design requirements; ten is a legacy comparison only",
        "lead_scenario": "housing_led_working_case",
        "comparison_scenario": "larger_shared_city_case",
        "compute_area": "derived from rack, cooling, power-room, maintenance and redundancy requirements; not a fixed percentage",
    },
    "population": {
        "humans": HUMANS,
        "paired_ai": PAIRED_AI,
        "additional_logistical_ai": "unquantified",
        "additional_independent_ai": "unquantified",
    },
    "legacy_geometry": {
        "shape": "square tiers; excludes an explicit subsidiary-wing model",
        "tier_count": 10,
        "status": "historical reference only; the new massing geometry is not yet modeled",
        "base_side_m": 3.5 * 1609.344,
        "base_area_km2": (3.5 * 1609.344) ** 2 / 1e6,
        "calculated_above_ground_gross_sqft": sum(36 * (18480 - 1100*i)**2 for i in range(10)),
        "published_rounded_gross_m2": GROSS_M2,
        "published_rounded_usable_m2": USABLE_M2,
        "usable_m2_per_human": USABLE_M2 / HUMANS,
        "usable_sqft_per_human": USABLE_SQFT / HUMANS,
        "residential_m2_per_human_at_25_percent": USABLE_M2 * .25 / HUMANS,
        "private_m2_per_human_at_60_percent_of_residential": USABLE_M2 * .25 * .60 / HUMANS,
    },
    "area_scenarios": [],
    "electricity_scenarios": [],
}
for m2_per_human in [USABLE_M2 / HUMANS, 80, 100, 150]:
    multiplier = m2_per_human * HUMANS / USABLE_M2
    results["area_scenarios"].append({
        "usable_m2_per_human": m2_per_human,
        "usable_area_billion_m2": m2_per_human * HUMANS / 1e9,
        "gross_area_billion_m2_at_70_percent_efficiency": m2_per_human * HUMANS / .70 / 1e9,
        "legacy_floor_area_multiplier": multiplier,
        "square_base_side_miles_same_height_and_relative_taper": 3.5 * math.sqrt(multiplier),
    })

# Illustrative inputs only; no per-capita wattage has been adopted as a design target.
# Non-compute includes human services, HVAC, transport, food systems, water, etc.
# AI facility allowance excludes any logistics/edge AI power already in non-compute.
for noncompute_w_per_human in [300, 600, 1000]:
    it_gw = 6.175
    pue = 1.2
    noncompute_gw = HUMANS * noncompute_w_per_human / 1e9
    results["electricity_scenarios"].append({
        "assumed_average_noncompute_w_per_human": noncompute_w_per_human,
        "noncompute_gw": noncompute_gw,
        "held_constant_legacy_ai_it_gw": it_gw,
        "assumed_ai_facility_pue": pue,
        "ai_facility_gw": it_gw * pue,
        "total_average_gw": noncompute_gw + it_gw * pue,
        "annual_twh": (noncompute_gw + it_gw * pue) * 8.76,
        "note": "AI capacity adequacy and peak demand are unestablished",
    })

results["human_flows"] = {
    "assumed_water_l_per_person_day": 200,
    "daily_domestic_water_billion_l": HUMANS * 200 / 1e9,
    "makeup_billion_l_day_if_95_percent_of_this_stream_recovered": HUMANS * 200 * .05 / 1e9,
    "assumed_kcal_per_person_day": 2000,
    "food_billion_kcal_per_day": HUMANS * 2000 / 1e9,
    "metabolic_heat_gw_at_100_w_per_person": HUMANS * 100 / 1e9,
    "exclusions": "Water: cooling, food production, industrial use, blowdown, leakage beyond assumed recovery. Food: distribution loss and diet detail.",
}
results["ai_capacity_ratios_not_service_sizing"] = {
    "legacy_gpu_count": 26800 * 72,
    "paired_ai_per_legacy_gpu": PAIRED_AI / (26800 * 72),
    "legacy_it_average_w_per_paired_ai": 6.175e9 / PAIRED_AI,
    "note": "These ratios do not establish concurrency, inference performance, memory capacity, or redundancy.",
}
results["material_proxy"] = []
for equivalent_floor_concrete_m in [.15, .25]:
    volume = GROSS_M2 * equivalent_floor_concrete_m
    # Hypothetical mix and historical kiln benchmark: not a selected recipe or EPD.
    cement_t_per_m3 = .30
    clinker_fraction = .71
    kiln_gj_per_t_clinker = 3.6
    results["material_proxy"].append({
        "equivalent_floor_concrete_m": equivalent_floor_concrete_m,
        "concrete_billion_m3": volume / 1e9,
        "concrete_billion_t_at_2400_kg_m3": volume * 2.4 / 1e9,
        "annual_concrete_million_m3_if_30_years": volume / 30 / 1e6,
        "hypothetical_cement_t_per_m3": cement_t_per_m3,
        "historical_clinker_fraction": clinker_fraction,
        "historical_kiln_gj_per_t_clinker": kiln_gj_per_t_clinker,
        "clinker_kiln_thermal_energy_twh": volume * cement_t_per_m3 * clinker_fraction * kiln_gj_per_t_clinker / 3.6e6,
        "exclusions": "Cores, columns, foundations, steel, earthworks, walls, facade, plant, manufacture electricity, transport, lifting. Not a minimum or specification.",
    })
results["cooling_proxy"] = {
    "evaporation_only_million_l_day_for_legacy_it_6_175_gw": 6.175e9 * 86400 / 2.45e6 / 1e6,
    "assumed_latent_heat_j_per_kg": 2.45e6,
    "note": "All IT heat removed by evaporation only; excludes blowdown and facility overhead. Dry/hybrid/reuse choices change water demand.",
}

# Residential-driven scenarios supersede earlier per-capita area exploration.
# Residential efficiency: private homes / residential program including shared areas.
# Residential share: residential program / all usable city floor area.
results["residential_requirement"] = {
    "private_sqft_per_human": PRIVATE_HOME_SQFT_PER_HUMAN,
    "private_sqft_family_of_four": 4 * PRIVATE_HOME_SQFT_PER_HUMAN,
    "total_private_home_billion_sqft": HUMANS * PRIVATE_HOME_SQFT_PER_HUMAN / 1e9,
    "total_private_home_billion_m2": HUMANS * PRIVATE_HOME_SQFT_PER_HUMAN * SQFT_TO_M2 / 1e9,
}
results["early_scenario_status"] = "area_scenarios were initial exploration before the 750 sqft private-home requirement; they are not current proposals. Use residential_driven_scenarios. material_proxy uses legacy geometry."
results["residential_driven_scenarios"] = []
for name, residential_efficiency, residential_share in [
    ("legacy_allocation_reapplied", .60, .25),
    ("housing_led_working_case", .80, .50),
    ("larger_shared_city_case", .75, .40),
]:
    private_sqft = HUMANS * PRIVATE_HOME_SQFT_PER_HUMAN
    residential_sqft = private_sqft / residential_efficiency
    usable_sqft = residential_sqft / residential_share
    gross_sqft = usable_sqft / .70
    # Ratios use published rounded gross total for same-height massing comparisons.
    area_multiplier = gross_sqft / GROSS_SQFT
    gross_m2 = gross_sqft * SQFT_TO_M2
    usable_m2 = usable_sqft * SQFT_TO_M2
    floor_volumes = [gross_m2 * t for t in [.15, .25]]
    scenarios = {
        "name": name,
        "study_role": ("lead" if name == "housing_led_working_case" else "comparison" if name == "larger_shared_city_case" else "historical_reference"),
        "assumed_private_fraction_of_residential_program": residential_efficiency,
        "assumed_residential_fraction_of_usable_city": residential_share,
        "assumed_usable_to_gross_efficiency": .70,
        "residential_program_billion_sqft": residential_sqft / 1e9,
        "private_home_billion_sqft": private_sqft / 1e9,
        "shared_residential_billion_sqft": (residential_sqft - private_sqft) / 1e9,
        "other_city_program_billion_sqft": (usable_sqft - residential_sqft) / 1e9,
        "city_usable_billion_sqft": usable_sqft / 1e9,
        "city_gross_billion_sqft": gross_sqft / 1e9,
        "city_usable_billion_m2": usable_m2 / 1e9,
        "city_gross_billion_m2": gross_m2 / 1e9,
        "gross_area_multiple_of_legacy": area_multiplier,
        "equivalent_square_base_side_miles": 3.5 * math.sqrt(area_multiplier),
        "equivalent_square_base_area_km2": (3.5 * 1609.344)**2 * area_multiplier / 1e6,
        "floor_concrete_proxy_billion_m3_150_250_mm": [v / 1e9 for v in floor_volumes],
        "floor_concrete_proxy_million_m3_per_year_over_30_years": [v / 30 / 1e6 for v in floor_volumes],
        "floor_proxy_clinker_kiln_thermal_twh": [v * .30 * .71 * 3.6 / 3.6e6 for v in floor_volumes],
        "legacy_150_usd_sqft_cost_arithmetic_trillion_usd": gross_sqft * 150 / 1e12,
        "notes": "Sizes are square-tier equivalents at unchanged height and relative taper, not a fit to the image; concrete, cost and efficiency are sensitivity inputs only.",
    }
    if name == "housing_led_working_case":
        # Area-led operating sensitivity: deliberately independent of per-person cases.
        # Building services only; exclude AI IT, off-site supply chains, and process loads.
        conditioned_m2 = usable_m2 * .75
        scenarios["area_led_building_electricity_sensitivity"] = {
            "assumed_conditioned_noncompute_fraction_of_usable_area": .75,
            "conditioned_noncompute_billion_m2": conditioned_m2 / 1e9,
            "cases": [{
                "assumed_annual_building_electricity_kwh_per_m2": eui,
                "annual_twh": conditioned_m2 * eui / 1e9,
                "average_gw": conditioned_m2 * eui / 8760 / 1e6,
            } for eui in [50, 100, 150]],
            "note": "Sensitivity inputs, not predictions or asserted benchmarks. Do not add to per-capita building scenarios: they overlap. Add separately modeled excluded loads only.",
        }
    results["residential_driven_scenarios"].append(scenarios)
output = Path(__file__).with_name("arcology-scale-results.json")
output.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
print(json.dumps(results, indent=2))
