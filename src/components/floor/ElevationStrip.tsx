// ============================================================
// ElevationStrip — "you are here" on the section of Arcology One
// ============================================================
// Ten terraced tiers of 36 floors each (14 ft floor to floor), 30 subfloors
// at 16 ft, and a core band. Horizontal scale is compressed so the strip
// reads at a glance; the vertical position of the lit floor is to scale.
// Geometry from structural-engineering/superstructure/primary-geometry.

const TIERS = 10;
const FLOORS_PER_TIER = 36;
const FT_PER_FLOOR = 14;
const TOTAL_FT = TIERS * FLOORS_PER_TIER * FT_PER_FLOOR; // 5,040

const W = 640;
const H = 150;
const GROUND_Y = 118;
const TOP_Y = 22;
const BASE_X = 20;
const BASE_W = 440;
const SETBACK = 13;
const SUB_H = 12;

interface Props {
  floor: number;
  elevationFt: number;
  tier: number;
}

export default function ElevationStrip({ floor, elevationFt, tier }: Props) {
  const tierH = (GROUND_Y - TOP_Y) / TIERS;
  const floorY = GROUND_Y - (elevationFt / TOTAL_FT) * (GROUND_Y - TOP_Y);
  const tierIndex = Math.min(TIERS, Math.max(1, tier)) - 1;
  const tierX = BASE_X + SETBACK * tierIndex;
  const tierW = BASE_W - SETBACK * 2 * tierIndex;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto block"
      role="img"
      aria-label={`Section of Arcology One with Floor ${floor} marked at ${elevationFt.toLocaleString()} feet, in tier ${tier} of ${TIERS}.`}
    >
      {/* core band */}
      <rect x={BASE_X + BASE_W / 2 - 22} y={TOP_Y} width={44} height={GROUND_Y - TOP_Y + SUB_H} className="dl-elev-core" />

      {/* tiers, bottom to top */}
      {Array.from({ length: TIERS }, (_, i) => {
        const x = BASE_X + SETBACK * i;
        const w = BASE_W - SETBACK * 2 * i;
        const y = GROUND_Y - tierH * (i + 1);
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={tierH} className="dl-elev-tier" />
            {/* terrace ledges on the setbacks */}
            {i > 0 && (
              <>
                <rect x={x - SETBACK} y={y + tierH - 1.5} width={SETBACK} height={2} className="dl-elev-terrace" />
                <rect x={x + w} y={y + tierH - 1.5} width={SETBACK} height={2} className="dl-elev-terrace" />
              </>
            )}
          </g>
        );
      })}
      {/* top terrace */}
      <rect x={BASE_X + SETBACK * (TIERS - 1)} y={TOP_Y - 1.5} width={BASE_W - SETBACK * 2 * (TIERS - 1)} height={2} className="dl-elev-terrace" />

      {/* subfloors and ground */}
      <rect x={BASE_X} y={GROUND_Y} width={BASE_W} height={SUB_H} className="dl-elev-sub" />
      <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} className="dl-elev-ground" />

      {/* the lit floor */}
      <line x1={tierX} y1={floorY} x2={tierX + tierW} y2={floorY} className="dl-elev-floorline" />
      <circle cx={tierX + tierW} cy={floorY} r={4.5} className="dl-elev-pin" />
      <line x1={tierX + tierW + 5} y1={floorY} x2={490} y2={floorY} className="dl-elev-leader" />
      <text x={496} y={floorY - 3} className="dl-elev-label dl-elev-label-strong">
        Floor {floor} · {elevationFt.toLocaleString()} ft
      </text>
      <text x={496} y={floorY + 10} className="dl-elev-label">
        tier {tier} of {TIERS} · floor {floor} of {TIERS * FLOORS_PER_TIER}
      </text>

      {/* scale notes */}
      <text x={BASE_X} y={H - 8} className="dl-elev-label">
        section · horizontal scale compressed · ground at 0 ft · spire at {TOTAL_FT.toLocaleString()} ft
      </text>
    </svg>
  );
}
