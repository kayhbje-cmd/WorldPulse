// src/services/aiCost.service.ts
import { Category, CostAnalysis } from '../types';

export function generateAICostAnalysis(
  category: Category,
  title: string,
  description: string,
  priority: 'low' | 'medium' | 'high' | 'critical'
): CostAnalysis {
  const combined = `${title} ${description}`.toLowerCase();

  switch (category) {
    case 'infrastructure': {
      const isSevere = combined.includes('bridge') || combined.includes('deep') || priority === 'critical';
      return {
        estimatedCost: {
          min: isSevere ? 75000 : 25000,
          max: isSevere ? 135000 : 45000,
          currency: 'INR',
        },
        severity: priority,
        urgency: priority,
        timeToComplete: isSevere ? '3-5 days' : '1-2 days',
        materialsNeeded: [
          'Dense Bituminous Macadam (DBM grade II)',
          'VG-30 Hot Paving Grade Bitumen',
          'Tack coat cationic bitumen emulsion',
          'Stone dust and aggregate mineral filler',
        ],
        laborRequired: '6 road maintenance crew, 1 asphalt spreader operator, 1 site safety supervisor',
        equipmentNeeded: [
          '8-10 ton Tandem Vibratory Roller',
          'Hydraulic Road Cutter',
          'Bitumen Pressure Distributor',
          'Air Compressor for debris cleaning',
        ],
        breakdown: {
          materials: isSevere ? 70000 : 22000,
          labor: isSevere ? 35000 : 12000,
          equipment: isSevere ? 30000 : 11000,
        },
        factors: [
          'High traffic axle load impacts durability',
          'Moisture entrapment under base coarse',
          'Proximity to storm water channels',
        ],
        recommendations:
          'Mill damaged edges at 90-degree square profiles, apply RS-1 emulsion tack coat, and compact in two 40mm lifts to prevent future reflective cracking.',
      };
    }

    case 'sanitation': {
      const isHigh = priority === 'high' || priority === 'critical';
      return {
        estimatedCost: {
          min: isHigh ? 12000 : 6000,
          max: isHigh ? 22000 : 11000,
          currency: 'INR',
        },
        severity: priority,
        urgency: priority,
        timeToComplete: '12-24 hours',
        materialsNeeded: [
          'Lime bleaching powder (CaOCl2, 50kg)',
          'Cresol-based disinfectant spray (20L)',
          'Heavy-duty HDPE 1100L community garbage bin',
          'Reflective safety caution tape',
        ],
        laborRequired: '4 solid waste management workers with Class-3 PPE, 1 sanitary supervisor',
        equipmentNeeded: [
          'Hydraulic Rear-Loading Compactor Vehicle',
          'Power high-pressure jet washer',
          'Handheld disinfectant sprayer',
        ],
        breakdown: {
          materials: isHigh ? 8000 : 4000,
          labor: isHigh ? 7000 : 3500,
          equipment: isHigh ? 7000 : 3500,
        },
        factors: [
          'Public health hazard due to pathogen vectors',
          'Stray animal scatter and drain blockage',
        ],
        recommendations:
          'Execute urgent deep clearance, power wash surface with 2% sodium hypochlorite solution, and introduce twice-daily collection rounds.',
      };
    }

    case 'utilities': {
      const isPipe = combined.includes('water') || combined.includes('pipe') || combined.includes('leak');
      return {
        estimatedCost: {
          min: isPipe ? 30000 : 15000,
          max: isPipe ? 55000 : 28000,
          currency: 'INR',
        },
        severity: priority,
        urgency: priority,
        timeToComplete: isPipe ? '8-12 hours' : '1-2 days',
        materialsNeeded: [
          'Ductile Iron (DI) Class K9 mechanical split repair clamp',
          'EPDM heavy duty sealing gasket',
          'M-30 rapid hardening concrete thrust block',
          'Anti-corrosive primer sleeve',
        ],
        laborRequired: '3 municipal pipeline fitters, 2 manual excavators, 1 pipeline engineer',
        equipmentNeeded: [
          'High capacity 5HP submersible dewatering pump',
          'Compact backhoe loader (JCB)',
          'Ultrasonic leak detector and pressure gauge',
        ],
        breakdown: {
          materials: isPipe ? 25000 : 12000,
          labor: isPipe ? 16000 : 9000,
          equipment: isPipe ? 14000 : 7000,
        },
        factors: [
          'Loss of municipal treated drinking water',
          'Subsurface soil erosion endangering road foundation',
        ],
        recommendations:
          'Isolate zone sluice valve, excavate trench with shoring support, clamp ruptured joint, and perform hydrostatic test at 4 bar before backfilling.',
      };
    }

    case 'safety': {
      return {
        estimatedCost: {
          min: 8000,
          max: 18000,
          currency: 'INR',
        },
        severity: priority,
        urgency: priority,
        timeToComplete: '4-8 hours',
        materialsNeeded: [
          '1100V grade 4-core aluminum armored XLPE cable',
          'Heavy gauge cast iron manhole cover & frame',
          '70W LED streetlight fixture with IP66 surge protection',
          'Heat shrinkable waterproof termination sleeve',
        ],
        laborRequired: '2 certified wiremen, 1 electrical junior engineer',
        equipmentNeeded: [
          'Hydraulic cherry picker bucket truck',
          'Earth resistance digital tester',
          'Cordon barricades and blinker lamps',
        ],
        breakdown: {
          materials: 9000,
          labor: 5000,
          equipment: 4000,
        },
        factors: [
          'Imminent electrocution or fall risk to pedestrians',
          'Monsoon humidity and standing water hazard',
        ],
        recommendations:
          'De-energize feeder circuit immediately, test insulation resistance (>50 mega-ohms), install grounded cast iron casing, and seal junction boxes.',
      };
    }

    case 'access': {
      return {
        estimatedCost: {
          min: 15000,
          max: 28000,
          currency: 'INR',
        },
        severity: priority,
        urgency: priority,
        timeToComplete: '2-3 days',
        materialsNeeded: [
          'Warning & directional yellow tactile paving tiles (300x300mm)',
          'Grade 304 stainless steel double-tier handrails',
          'Non-slip textured concrete screed',
        ],
        laborRequired: '2 civil masons, 1 metal fabricator',
        equipmentNeeded: [
          'Rotary demolition hammer',
          'Concrete batch mixer',
          'Angle grinder and level meter',
        ],
        breakdown: {
          materials: 14000,
          labor: 8000,
          equipment: 6000,
        },
        factors: [
          'Compliance with Rights of Persons with Disabilities (RPwD) Act',
          'Elderly and hospital patient mobility',
        ],
        recommendations:
          'Demolish obstructive bollards, reconstruct ramp to gentle 1:12 slope gradient, and install tactile blister pavers at 300mm transition zones.',
      };
    }

    default: {
      return {
        estimatedCost: {
          min: 10000,
          max: 20000,
          currency: 'INR',
        },
        severity: priority,
        urgency: priority,
        timeToComplete: '2-3 days',
        materialsNeeded: [
          'Municipal grade maintenance consumables',
          'Surface restoration mortar',
          'Safety marking paint and signage',
        ],
        laborRequired: '2 municipal technicians, 1 supervisor',
        equipmentNeeded: ['Standard civic maintenance utility kit'],
        breakdown: {
          materials: 8000,
          labor: 6000,
          equipment: 6000,
        },
        factors: ['Public community welfare', 'General municipal upkeep'],
        recommendations:
          'Conduct on-site engineering survey, coordinate with ward junior engineer, and rectify within standard 72-hour citizen charter timeframe.',
      };
    }
  }
}
