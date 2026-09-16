/**
 * Personal Destiny Matrix calculation (destiny-matrix-22).
 * Same reduction + vertex formulas as the main chart / compatibility tool.
 */

export function reduceNumber(number) {
  if (!Number.isFinite(number)) {
    throw new RangeError('number must be a finite number');
  }
  if (number > 22) {
    return (number % 10) + Math.floor(number / 10);
  }
  return number;
}

export const normalizeEnergy = reduceNumber;

export function calculateYear(year) {
  let y = 0;
  let current = year;
  while (current > 0) {
    y += current % 10;
    current = Math.floor(current / 10);
  }
  return reduceNumber(y);
}

function daysInMonth(year, month) {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const lengths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month - 1];
}

export function parseBirthDate(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('Please enter the child\'s date of birth.');
  }
  const raw = input.trim();
  let year;
  let month;
  let day;

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const dmy = raw.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);

  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (dmy) {
    day = Number(dmy[1]);
    month = Number(dmy[2]);
    year = Number(dmy[3]);
  } else {
    throw new Error('Use a valid date like 2018-06-14 or 14/06/2018.');
  }

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new Error('That birth date is not a real calendar date.');
  }

  const today = new Date();
  const birth = new Date(Date.UTC(year, month - 1, day));
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (birth > todayUtc) {
    throw new Error('Birth date cannot be in the future.');
  }

  return { year, month, day, iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` };
}

export function ageFromParts(year, month, day, now = new Date()) {
  let age = now.getFullYear() - year;
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (m < month || (m === month && d < day)) age -= 1;
  return Math.max(0, age);
}

export function ageBand(age) {
  if (age <= 5) return '0-5';
  if (age <= 9) return '6-9';
  if (age <= 13) return '10-13';
  if (age <= 17) return '14-17';
  return '18+';
}

export function calculateMatrix(aPoint, bPoint, cPoint) {
  const dpoint = reduceNumber(aPoint + bPoint + cPoint);
  const epoint = reduceNumber(aPoint + bPoint + cPoint + dpoint);
  const fpoint = reduceNumber(aPoint + bPoint);
  const gpoint = reduceNumber(bPoint + cPoint);
  const hpoint = reduceNumber(dpoint + aPoint);
  const ipoint = reduceNumber(cPoint + dpoint);
  const jpoint = reduceNumber(dpoint + epoint);

  const npoint = reduceNumber(cPoint + epoint);
  const lpoint = reduceNumber(jpoint + npoint);
  const mpoint = reduceNumber(lpoint + npoint);
  const kpoint = reduceNumber(jpoint + lpoint);

  const qpoint = reduceNumber(npoint + cPoint);
  const rpoint = reduceNumber(jpoint + dpoint);
  const spoint = reduceNumber(aPoint + epoint);
  const tpoint = reduceNumber(bPoint + epoint);

  const opoint = reduceNumber(aPoint + spoint);
  const ppoint = reduceNumber(bPoint + tpoint);

  const upoint = reduceNumber(fpoint + gpoint + hpoint + ipoint);
  const vpoint = reduceNumber(epoint + upoint);
  const wpoint = reduceNumber(spoint + epoint);
  const xpoint = reduceNumber(tpoint + epoint);

  const f2point = reduceNumber(fpoint + upoint);
  const f1point = reduceNumber(fpoint + f2point);
  const g2point = reduceNumber(gpoint + upoint);
  const g1point = reduceNumber(gpoint + g2point);
  const i2point = reduceNumber(ipoint + upoint);
  const i1point = reduceNumber(ipoint + i2point);
  const h2point = reduceNumber(hpoint + upoint);
  const h1point = reduceNumber(hpoint + h2point);

  const skypoint = reduceNumber(bPoint + dpoint);
  const earthpoint = reduceNumber(aPoint + cPoint);
  const perspurpose = reduceNumber(skypoint + earthpoint);
  const femalepoint = reduceNumber(gpoint + hpoint);
  const malepoint = reduceNumber(fpoint + ipoint);
  const socialpurpose = reduceNumber(femalepoint + malepoint);
  const generalpurpose = reduceNumber(perspurpose + socialpurpose);
  const planetarypurpose = reduceNumber(socialpurpose + generalpurpose);

  const points = {
    apoint: aPoint,
    bpoint: bPoint,
    cpoint: cPoint,
    dpoint,
    epoint,
    fpoint,
    gpoint,
    hpoint,
    ipoint,
    jpoint,
    kpoint,
    lpoint,
    mpoint,
    npoint,
    opoint,
    ppoint,
    qpoint,
    rpoint,
    spoint,
    tpoint,
    upoint,
    vpoint,
    wpoint,
    xpoint,
    f2point,
    f1point,
    g2point,
    g1point,
    i2point,
    i1point,
    h2point,
    h1point,
  };

  const purposes = {
    skypoint,
    earthpoint,
    perspurpose,
    femalepoint,
    malepoint,
    socialpurpose,
    generalpurpose,
    planetarypurpose,
  };

  return { points, purposes };
}

export function calculateFromBirthDate(isoOrParts) {
  const parts =
    typeof isoOrParts === 'string'
      ? parseBirthDate(isoOrParts)
      : isoOrParts;
  const apoint = reduceNumber(parts.day);
  const bpoint = parts.month;
  const cpoint = calculateYear(parts.year);
  const matrix = calculateMatrix(apoint, bpoint, cpoint);
  return { ...matrix, anchors: { apoint, bpoint, cpoint }, birth: parts };
}

export function sanitizeName(name, label = 'Name') {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error(`Please enter the child's name.`);
  }
  const cleaned = name.replace(/<[^>]*>/g, '').trim().slice(0, 80);
  if (!cleaned) {
    throw new Error(`${label} is required.`);
  }
  return cleaned;
}
