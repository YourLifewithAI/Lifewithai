import copy
import math
import unittest
from model import read_inputs,build_case,ledger,graph_reachable,program
from build import geometric_checks

class SectionStudyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p,cls.source=read_inputs()
        cls.cases={v["id"]:build_case(cls.p,cls.source,v) for v in cls.p["variants"]}

    def test_equal_private_and_civic_program_all_cases(self):
        ledgers=[ledger(c,self.p) for c in self.cases.values()]
        for l in ledgers:
            self.assertAlmostEqual(l["private_home_sqft"],60_000_000,places=5)
            self.assertEqual(l["humans"],80000)
            self.assertEqual(l["paired_ai"],80000)
        for key in ("private_home_m2","civic_gross_m2","residential_gross_m2"):
            self.assertEqual(len({l[key] for l in ledgers}),1)

    def test_support_grid_continuity_and_step_cost(self):
        a=ledger(self.cases["aligned"],self.p);s=ledger(self.cases["stepped"],self.p)
        self.assertEqual((a["support_axes"],a["upper_only_axes"]),(256,0))
        self.assertEqual((s["support_axes"],s["upper_only_axes"]),(320,64))
        self.assertEqual(s["shared_lower_upper_axes"],192)

    def test_voids_reservations_and_sensors_are_spatially_consistent(self):
        for case in self.cases.values():
            result=geometric_checks(case,self.p)
            self.assertEqual(result["plant_reserved_gross_m2"],2048)
            self.assertEqual(result["floor_area_and_overlap"],"passed")
        self.assertGreater(geometric_checks(self.cases["stepped"],self.p)["uncovered_lower_roof_footprint_m2"],0)
        self.assertAlmostEqual(geometric_checks(self.cases["aligned"],self.p)["uncovered_lower_roof_footprint_m2"],0)

    def test_separation_adds_exact_gap_to_each_boundary_span(self):
        a=ledger(self.cases["aligned"],self.p);s=ledger(self.cases["separated"],self.p)
        self.assertAlmostEqual(s["longest_bridge_span_m"]-a["longest_bridge_span_m"],140)

    def test_utility_paths_survive_single_fault_but_not_all_sources(self):
        for case in self.cases.values():
            l=ledger(case,self.p)
            self.assertEqual(l["single_edge_loss_min_districts_reachable"],4)
            self.assertEqual(l["single_plant_interface_loss_min_districts_reachable"],4)
            self.assertEqual(l["A_spine_loss_districts_reachable"],4)
            self.assertEqual(l["all_section_entries_lost_districts_reachable"],0)

    def test_no_false_connectivity_after_both_local_branches_lost(self):
        net=self.cases["aligned"]["utility"]
        reached=graph_reachable(net,["PLANT-U1-A-branch","PLANT-U1-B-branch"])
        self.assertEqual(reached,{"L1","L2","U2"})

    def test_non_grid_step_is_rejected_instead_of_inventing_transfer(self):
        p=copy.deepcopy(self.p);p["variants"][1]["upper_offset_y_m"]=70
        with self.assertRaisesRegex(ValueError,"grid"):
            program(p,self.source)

    def test_housing_minimum_and_unsupported_topology_cannot_drift(self):
        source=copy.deepcopy(self.source);source["requirements"]["private_home_sqft_per_human"]=500
        with self.assertRaises(ValueError):program(self.p,source)
        source=copy.deepcopy(self.source);source["district"]["residential_blocks"]=9
        with self.assertRaises(ValueError):program(self.p,source)

    def test_comparative_sensor_ids_match(self):
        values=[{(s["id"],s["kind"]) for s in c["sensors"]} for c in self.cases.values()]
        self.assertTrue(all(v==values[0] for v in values))
        self.assertEqual(len(values[0]),1600)

if __name__=="__main__":unittest.main()
