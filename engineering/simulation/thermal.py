"""Synthetic heat-balance benchmark, in EnergyPlus 26.1 epJSON (SI)."""
from models import positive


def thermal_box(gain_w=1000):
    positive(gain_w, "convective gain W", zero=True)
    model = {}

    def add(kind, name, **fields):
        model.setdefault(kind, {})[name] = fields

    add("Version", "Version", version_identifier="26.1")
    add("SimulationControl", "Control", do_zone_sizing_calculation="No",
        do_system_sizing_calculation="No", do_plant_sizing_calculation="No",
        run_simulation_for_sizing_periods="Yes", run_simulation_for_weather_file_run_periods="No")
    add("Building", "Synthetic adiabatic test", north_axis=0, terrain="Suburbs",
        loads_convergence_tolerance_value=0.001, temperature_convergence_tolerance_value=0.001,
        solar_distribution="MinimalShadowing", maximum_number_of_warmup_days=50,
        minimum_number_of_warmup_days=6)
    add("Timestep", "Timestep", number_of_timesteps_per_hour=4)
    add("Site:Location", "Synthetic equatorial sea level", latitude=0, longitude=0,
        time_zone=0, elevation=0)
    add("SizingPeriod:DesignDay", "Synthetic constant hot day", month=7, day_of_month=21,
        day_type="SummerDesignDay", maximum_dry_bulb_temperature=35,
        daily_dry_bulb_temperature_range=0, humidity_condition_type="WetBulb",
        wetbulb_or_dewpoint_at_maximum_dry_bulb=23, barometric_pressure=101325,
        wind_speed=3, wind_direction=0, sky_clearness=0)
    add("GlobalGeometryRules", "Rules", starting_vertex_position="UpperLeftCorner",
        vertex_entry_direction="Counterclockwise", coordinate_system="World")
    add("Zone", "TestZone", direction_of_relative_north=0, x_origin=0, y_origin=0,
        z_origin=0, type=1, multiplier=1, ceiling_height=3, volume=36, floor_area=12)
    add("Material:NoMass", "Massless insulation", roughness="MediumRough", thermal_resistance=2,
        thermal_absorptance=0.9, solar_absorptance=0.7, visible_absorptance=0.7)
    add("Construction", "Adiabatic envelope", outside_layer="Massless insulation")
    surfaces = {
        "Floor": ("Floor", [(0,3,0),(4,3,0),(4,0,0),(0,0,0)]),
        "Roof": ("Roof", [(0,0,3),(4,0,3),(4,3,3),(0,3,3)]),
        "South": ("Wall", [(0,0,3),(0,0,0),(4,0,0),(4,0,3)]),
        "East": ("Wall", [(4,0,3),(4,0,0),(4,3,0),(4,3,3)]),
        "North": ("Wall", [(4,3,3),(4,3,0),(0,3,0),(0,3,3)]),
        "West": ("Wall", [(0,3,3),(0,3,0),(0,0,0),(0,0,3)]),
    }
    for name, (kind, coords) in surfaces.items():
        add("BuildingSurface:Detailed", name, surface_type=kind,
            construction_name="Adiabatic envelope", zone_name="TestZone",
            outside_boundary_condition="Adiabatic", sun_exposure="NoSun", wind_exposure="NoWind",
            number_of_vertices=4, vertices=[dict(zip(
                ["vertex_x_coordinate", "vertex_y_coordinate", "vertex_z_coordinate"], p)) for p in coords])
    add("ScheduleTypeLimits", "Fraction", lower_limit_value=0, upper_limit_value=1,
        numeric_type="Continuous", unit_type="Dimensionless")
    add("ScheduleTypeLimits", "ControlType", lower_limit_value=0, upper_limit_value=4,
        numeric_type="Discrete", unit_type="Control")
    add("ScheduleTypeLimits", "Temperature", numeric_type="Continuous", unit_type="Temperature")
    for name, kind, value in [("AlwaysOn", "Fraction", 1), ("DualControl", "ControlType", 4),
                              ("Heating20", "Temperature", 20), ("Cooling24", "Temperature", 24)]:
        add("Schedule:Constant", name, schedule_type_limits_name=kind, hourly_value=value)
    add("Lights", "Convective test source", zone_or_zonelist_or_space_or_spacelist_name="TestZone",
        schedule_name="AlwaysOn", design_level_calculation_method="LightingLevel",
        lighting_level=gain_w, return_air_fraction=0, fraction_radiant=0, fraction_visible=0,
        fraction_replaceable=0)
    add("ThermostatSetpoint:DualSetpoint", "Setpoints", heating_setpoint_temperature_schedule_name="Heating20",
        cooling_setpoint_temperature_schedule_name="Cooling24")
    add("ZoneControl:Thermostat", "Thermostat", zone_or_zonelist_name="TestZone",
        control_type_schedule_name="DualControl", control_1_object_type="ThermostatSetpoint:DualSetpoint",
        control_1_name="Setpoints")
    add("ZoneHVAC:EquipmentConnections", "Connections", zone_name="TestZone",
        zone_conditioning_equipment_list_name="Equipment", zone_air_inlet_node_or_nodelist_name="Supply",
        zone_air_node_name="ZoneAir", zone_return_air_node_or_nodelist_name="Return")
    add("ZoneHVAC:EquipmentList", "Equipment", load_distribution_scheme="SequentialLoad",
        equipment=[{"zone_equipment_object_type": "ZoneHVAC:IdealLoadsAirSystem",
                    "zone_equipment_name": "IdealAir", "zone_equipment_cooling_sequence": 1,
                    "zone_equipment_heating_or_no_load_sequence": 1}])
    add("ZoneHVAC:IdealLoadsAirSystem", "IdealAir", availability_schedule_name="AlwaysOn",
        zone_supply_air_node_name="Supply", heating_limit="NoLimit", cooling_limit="NoLimit",
        dehumidification_control_type="None", humidification_control_type="None",
        outdoor_air_economizer_type="NoEconomizer", heat_recovery_type="None")
    add("Output:SQLite", "SQLite", option_type="SimpleAndTabular")
    for i, name in enumerate(("Zone Lights Electricity Energy", "Zone Ideal Loads Zone Sensible Cooling Energy",
                              "Zone Mean Air Temperature")):
        add("Output:Variable", f"Variable{i}", key_value="*", variable_name=name, reporting_frequency="Hourly")
    return model
