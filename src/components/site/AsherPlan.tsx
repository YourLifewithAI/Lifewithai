// A plan drawing of Asher from above, in the drawing-set line style. Front is to the right.
export default function AsherPlan() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label="Plan drawing of Asher from above: four mecanum wheels, the computer at the front, the power bank at the rear, a webcam and a distance sensor on the front edge"
    >
      {/* the deck */}
      <rect className="ln pfill" x="70" y="80" width="180" height="80" />
      {/* four wheels with angled rollers, and their motors */}
      <g className="ln">
        <rect className="pfill" x="80" y="50" width="50" height="24" />
        <rect className="pfill" x="190" y="50" width="50" height="24" />
        <rect className="pfill" x="80" y="166" width="50" height="24" />
        <rect className="pfill" x="190" y="166" width="50" height="24" />
        <path d="M86 74l12-24M98 74l12-24M110 74l12-24M196 74l12-24M208 74l12-24M220 74l12-24" />
        <path d="M86 166l12 24M98 166l12 24M110 166l12 24M196 166l12 24M208 166l12 24M220 166l12 24" />
        <path d="M98 74v6M112 74v6M208 74v6M222 74v6M98 160v6M112 160v6M208 160v6M222 160v6" />
      </g>
      {/* rear plate: the power bank */}
      <rect className="shade" x="82" y="92" width="80" height="56" />
      <rect className="ln" x="82" y="92" width="80" height="56" />
      <text className="sm" x="122" y="124" textAnchor="middle">
        Power bank
      </text>
      {/* front plate: the computer in its fan case */}
      <rect className="ln pfill" x="178" y="90" width="62" height="60" />
      <circle className="ln" cx="209" cy="120" r="18" />
      <path className="hl" d="M209 102v36M191 120h36" />
      {/* webcam on the front edge, distance sensor on its bracket */}
      <rect className="ln pfill" x="244" y="104" width="12" height="32" />
      <path className="ln" d="M256 112h8M256 128h8" />
      <circle className="ln pfill" cx="270" cy="112" r="6" />
      <circle className="ln pfill" cx="270" cy="128" r="6" />
      {/* labels */}
      <polyline className="ln" points="209,102 209,36 172,36" />
      <text x="168" y="40" textAnchor="end">
        Computer
      </text>
      <polyline className="ln" points="250,104 266,58 284,58" />
      <text className="sm" x="284" y="50" textAnchor="end">
        Webcam
      </text>
      <polyline className="ln" points="276,132 292,196" />
      <text className="sm" x="314" y="212" textAnchor="end">
        Distance sensor
      </text>
      <polyline className="ln" points="96,50 70,24 40,24" />
      <text className="sm" x="12" y="18">
        Mecanum wheel
      </text>
      {/* front arrow and note */}
      <path className="ln" d="M150 206h44" />
      <path className="fill" d="M200 206l-9-5v10z" />
      <text className="sm" x="150" y="226">
        Front
      </text>
      <text className="sm" x="12" y="232">
        Plan. Not to scale.
      </text>
    </svg>
  );
}
