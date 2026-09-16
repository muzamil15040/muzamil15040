import {
  calculateFromBirthDate,
  sanitizeName,
  ageFromParts,
  ageBand,
  parseBirthDate,
} from './calc.mjs';
import {
  METHODOLOGY,
  METHODOLOGY_VERSION,
  CHART_VERSION,
  resolvePositions,
  CHILD_POSITIONS,
} from './positions.mjs';
import { buildChartPayload } from './chart-config.mjs';
import { composeReading, nodeDetail } from './composer.mjs';

export function calculateChildrenMatrix(input) {
  const childIn = input?.child || {};
  const name = sanitizeName(childIn.name || input?.name);
  const birth = parseBirthDate(childIn.birthDate || input?.birthDate);
  const age = ageFromParts(birth.year, birth.month, birth.day);
  const band = ageBand(age);

  if (age > 25) {
    throw new Error(
      'This tool is designed for children and teens. For adult charts, use the personal Destiny Matrix calculator.'
    );
  }

  let guardianName = '';
  if (typeof input?.guardianName === 'string' && input.guardianName.trim()) {
    guardianName = input.guardianName.replace(/<[^>]*>/g, '').trim().slice(0, 80);
  }

  const matrix = calculateFromBirthDate(birth);
  const positions = resolvePositions(matrix);
  const chart = buildChartPayload(matrix, positions);

  let reading = null;
  let readingError = null;
  try {
    reading = composeReading({
      childName: name,
      age,
      ageBand: band,
      positions,
      guardianName,
    });
  } catch (err) {
    readingError =
      'The matrix was calculated successfully, but the detailed interpretation is temporarily unavailable.';
  }

  const details = {};
  for (const pos of positions) {
    details[pos.id] = nodeDetail(pos, pos.energy);
  }

  return {
    ok: true,
    methodology: METHODOLOGY,
    methodologyVersion: METHODOLOGY_VERSION,
    chartVersion: CHART_VERSION,
    child: {
      name,
      // DOB returned for on-screen private use only — never put in share URLs
      birthDate: birth.iso,
      age,
      ageBand: band,
    },
    guardianName: guardianName || undefined,
    matrix: {
      points: matrix.points,
      purposes: matrix.purposes,
      anchors: matrix.anchors,
    },
    positions,
    positionDefs: CHILD_POSITIONS.map(({ id, title, chartKey, description }) => ({
      id,
      title,
      chartKey,
      description,
    })),
    chart,
    details,
    reading,
    readingError,
  };
}
