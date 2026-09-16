import { calculateChildrenMatrix } from '../engine/service.mjs';
import { reduceNumber, calculateFromBirthDate, parseBirthDate } from '../engine/calc.mjs';
import { CONNECTIONS, POINT_COORDS, DISPLAY_NODES } from '../engine/chart-config.mjs';

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('FAIL:', msg);
  } else {
    console.log('ok:', msg);
  }
}

// Determinism
const a = calculateChildrenMatrix({ child: { name: 'Emma', birthDate: '2018-06-14' } });
const b = calculateChildrenMatrix({ child: { name: 'Emma', birthDate: '14/06/2018' } });
assert(a.matrix.points.epoint === 8, 'Emma core epoint is 8');
assert(a.matrix.points.epoint === b.matrix.points.epoint, 'ISO and DMY same core');
assert(JSON.stringify(a.matrix.points) === JSON.stringify(b.matrix.points), 'same points for same DOB');

// Muzamil reference from personal chart notes
const m = calculateFromBirthDate('1998-01-01');
assert(m.points.epoint === 22 && m.points.apoint === 1 && m.points.bpoint === 1 && m.points.cpoint === 9, '1998-01-01 anchors match personal chart');

// Positions
assert(a.positions.length === 13, '13 child positions');
assert(a.positions.every((p) => p.energy >= 1 && p.energy <= 22), 'energies in 1–22');

// Chart integrity
const ids = new Set(a.chart.nodes.map((n) => n.id));
assert(a.chart.nodes.every((n) => Number.isFinite(n.x) && Number.isFinite(n.y)), 'nodes have coordinates');
assert(CONNECTIONS.every(([x, y]) => POINT_COORDS[x] && POINT_COORDS[y]), 'connections reference coords');
assert(ids.has('epoint'), 'center exists');
assert(new Set(DISPLAY_NODES.map((n) => n.chartKey)).size === DISPLAY_NODES.length, 'no duplicate display node ids');

// Validation
let threw = false;
try { parseBirthDate('1997-02-29'); } catch { threw = true; }
assert(threw, 'invalid leap day rejected');
threw = false;
try { parseBirthDate('2099-01-01'); } catch { threw = true; }
assert(threw, 'future date rejected');
threw = false;
try { calculateChildrenMatrix({ child: { name: '', birthDate: '2018-06-14' } }); } catch { threw = true; }
assert(threw, 'missing name rejected');

// Leap day ok
const leap = calculateChildrenMatrix({ child: { name: 'Leap', birthDate: '2016-02-29' } });
assert(leap.ok && leap.matrix.points.epoint >= 1, '2016-02-29 accepted');

// reduceNumber
assert(reduceNumber(29) === 11, '29 → 11');
assert(reduceNumber(22) === 22, '22 stays 22');

// Reading present
assert(a.reading && a.reading.corePersonality && a.reading.parentSupport.length > 0, 'reading composed');
assert(!JSON.stringify(a.reading).toLowerCase().includes('destined to'), 'no destined language');

// Share privacy: response includes birthDate for UI but test documents share must not
assert(a.child.birthDate === '2018-06-14', 'birthDate available privately in response');

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nAll children-matrix tests passed.');
