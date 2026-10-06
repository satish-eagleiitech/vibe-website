const SIZE = 25;

function seeded(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

function inFinder(x: number, y: number) {
  const corners = [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ];
  return corners.some(([cx, cy]) => x >= cx - 1 && x <= cx + 7 && y >= cy - 1 && y <= cy + 7);
}

/** Decorative QR-style code, stable for a given value. Not scannable. */
export function FauxQr({ value, className = "" }: { value: string; className?: string }) {
  const rand = seeded(value);
  const cells: [number, number][] = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!inFinder(x, y) && rand() > 0.52) cells.push([x, y]);
    }
  }
  const finders = [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ];

  return (
    <svg
      viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
      className={className}
      role="img"
      aria-label="Ticket QR code"
      shapeRendering="crispEdges"
    >
      <rect x={-1} y={-1} width={SIZE + 2} height={SIZE + 2} fill="#fff" />
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={7} height={7} fill="#111827" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="#111827" />
        </g>
      ))}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#111827" />
      ))}
    </svg>
  );
}
