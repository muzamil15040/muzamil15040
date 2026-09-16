/** Personal-chart geometry (viewBox 0 0 680 600). */

export const VIEW_BOX = '0 0 680 600';
export const MATRIX_CENTER = { x: 333.7, y: 297 };

export const OUTER_OCTAGON = [
  { x: 333.7, y: 7.76 },
  { x: 537.64, y: 92.28 },
  { x: 622.17, y: 296.22 },
  { x: 537.64, y: 501.16 },
  { x: 333.7, y: 584.68 },
  { x: 129.76, y: 500.16 },
  { x: 45.24, y: 296.22 },
  { x: 129.76, y: 92.28 },
];

export const POINT_COORDS = {
  apoint: { x: 79.2, y: 297 },
  bpoint: { x: 333.7, y: 42 },
  cpoint: { x: 587.13, y: 297 },
  dpoint: { x: 332.7, y: 554 },
  epoint: { x: 334, y: 297 },
  fpoint: { x: 151, y: 114.22 },
  gpoint: { x: 515.1, y: 114.22 },
  hpoint: { x: 153, y: 479.62 },
  ipoint: { x: 514.1, y: 479.62 },
  jpoint: { x: 332.59, y: 466 },
  kpoint: { x: 375, y: 424 },
  lpoint: { x: 418.18, y: 380.69 },
  mpoint: { x: 461, y: 338 },
  npoint: { x: 500, y: 297 },
  opoint: { x: 127.11, y: 297 },
  ppoint: { x: 333.7, y: 90.62 },
  qpoint: { x: 538.5, y: 297 },
  rpoint: { x: 333, y: 505 },
  spoint: { x: 165.61, y: 297 },
  tpoint: { x: 333.7, y: 129 },
  upoint: { x: 382, y: 297 },
  vpoint: { x: 420.54, y: 297 },
  wpoint: { x: 245.26, y: 297 },
  xpoint: { x: 333.7, y: 203 },
};

/** Display nodes on the interactive chart (personal vertices + child labels). */
export const DISPLAY_NODES = [
  { chartKey: 'epoint', positionId: 'core', radius: 36, tier: 'center' },
  { chartKey: 'apoint', positionId: 'expression', radius: 30, tier: 'primary' },
  { chartKey: 'bpoint', positionId: 'talents', radius: 30, tier: 'primary' },
  { chartKey: 'cpoint', positionId: 'social', radius: 30, tier: 'primary' },
  { chartKey: 'dpoint', positionId: 'family', radius: 30, tier: 'primary' },
  { chartKey: 'tpoint', positionId: 'learning', radius: 24, tier: 'secondary' },
  { chartKey: 'wpoint', positionId: 'communication', radius: 24, tier: 'secondary' },
  { chartKey: 'jpoint', positionId: 'emotions', radius: 24, tier: 'secondary' },
  { chartKey: 'kpoint', positionId: 'creativity', radius: 22, tier: 'secondary' },
  { chartKey: 'spoint', positionId: 'motivation', radius: 24, tier: 'secondary' },
  { chartKey: 'xpoint', positionId: 'growth', radius: 24, tier: 'secondary' },
  { chartKey: 'rpoint', positionId: 'challenge', radius: 22, tier: 'secondary' },
  { chartKey: 'fpoint', positionId: null, radius: 18, tier: 'support' },
  { chartKey: 'gpoint', positionId: null, radius: 18, tier: 'support' },
  { chartKey: 'hpoint', positionId: null, radius: 18, tier: 'support' },
  { chartKey: 'ipoint', positionId: null, radius: 18, tier: 'support' },
  { chartKey: 'npoint', positionId: null, radius: 16, tier: 'support' },
  { chartKey: 'lpoint', positionId: null, radius: 16, tier: 'support' },
  { chartKey: 'mpoint', positionId: null, radius: 16, tier: 'support' },
  { chartKey: 'opoint', positionId: null, radius: 16, tier: 'support' },
  { chartKey: 'ppoint', positionId: null, radius: 16, tier: 'support' },
  { chartKey: 'qpoint', positionId: null, radius: 16, tier: 'support' },
  { chartKey: 'upoint', positionId: null, radius: 16, tier: 'support' },
  { chartKey: 'vpoint', positionId: null, radius: 16, tier: 'support' },
];

export const CONNECTIONS = [
  ['apoint', 'epoint'],
  ['bpoint', 'epoint'],
  ['cpoint', 'epoint'],
  ['dpoint', 'epoint'],
  ['apoint', 'fpoint'],
  ['bpoint', 'fpoint'],
  ['bpoint', 'gpoint'],
  ['cpoint', 'gpoint'],
  ['cpoint', 'ipoint'],
  ['dpoint', 'ipoint'],
  ['dpoint', 'hpoint'],
  ['apoint', 'hpoint'],
  ['fpoint', 'gpoint'],
  ['gpoint', 'ipoint'],
  ['ipoint', 'hpoint'],
  ['hpoint', 'fpoint'],
  ['jpoint', 'epoint'],
  ['npoint', 'epoint'],
  ['spoint', 'epoint'],
  ['tpoint', 'epoint'],
  ['jpoint', 'kpoint'],
  ['kpoint', 'lpoint'],
  ['lpoint', 'mpoint'],
  ['mpoint', 'npoint'],
  ['rpoint', 'jpoint'],
  ['rpoint', 'dpoint'],
  ['wpoint', 'epoint'],
  ['wpoint', 'spoint'],
  ['xpoint', 'epoint'],
  ['xpoint', 'tpoint'],
];

export const ARCANA_COLORS = {
  1: '#c9a227',
  2: '#7eb8d4',
  3: '#d4a5c9',
  4: '#c47a4a',
  5: '#8b7355',
  6: '#e08e9a',
  7: '#5b8def',
  8: '#d4af37',
  9: '#6b8e9f',
  10: '#e0a050',
  11: '#8f9fd4',
  12: '#7a9e7e',
  13: '#9a8aa8',
  14: '#6cb4a8',
  15: '#8a6a5a',
  16: '#b07070',
  17: '#7eb6e8',
  18: '#9bb0d4',
  19: '#e8c04a',
  20: '#c4a882',
  21: '#6aaf9a',
  22: '#b8a0d4',
};


export function buildChartPayload(matrix, positions) {
  const byId = Object.fromEntries(positions.map((p) => [p.id, p]));
  const nodes = DISPLAY_NODES.map((node) => {
    const energy = matrix.points[node.chartKey];
    const pos = node.positionId ? byId[node.positionId] : null;
    const coords = POINT_COORDS[node.chartKey];
    return {
      id: node.chartKey,
      chartKey: node.chartKey,
      positionId: node.positionId,
      label: pos ? pos.title : node.chartKey.replace('point', ''),
      energy,
      x: coords.x,
      y: coords.y,
      radius: node.radius,
      tier: node.tier,
      color: ARCANA_COLORS[energy] || '#c9a227',
    };
  });

  const purpose = positions.find((p) => p.id === 'purpose');

  return {
    viewBox: VIEW_BOX,
    center: MATRIX_CENTER,
    octagon: OUTER_OCTAGON,
    nodes,
    connections: CONNECTIONS,
    purposeBadge: purpose
      ? { energy: purpose.energy, title: purpose.title, chartKey: purpose.chartKey }
      : null,
  };
}
