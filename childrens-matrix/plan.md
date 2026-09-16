# Children's Destiny Matrix Chart — v2 local product plan

Standalone child/parent tool. Do **not** merge into the personal Destiny Matrix chart yet. Do **not** touch the original live project, Worker, or Pages.

Working folder: `childrens-matrix/` (drop into the v2 tree beside `compatibility/`). Source brainstorm: uploaded `childrens_destiny_matrix_chart_full_plan.md` (copied as `source-spec.md`).

---

## What improved vs the source spec

The source spec correctly demanded methodology lock-in before coding, but left formulas, geometry, and AI runtime open. This plan fills those gaps the same way the compatibility tool did:

| Gap in source spec | Locked decision |
|---|---|
| Exact methodology | Same personal Destiny Matrix 22-energy engine as the main chart (`reduceNumber`, `calculateMatrix`) |
| Exact child positions + formulas | Twelve parent-facing positions **mapped to existing vertices** — no invented numbers |
| Exact SVG geometry | Personal chart `viewBox 0 0 680 600` coordinates |
| Connections | Personal-chart frame lines; child labels only on mapped vertices |
| Energy 1–22 meanings | Local energy database + energy × position child facets |
| AI / interpretation | Local deterministic composer implementing the AI JSON contract (no live LLM) |
| Runtime | Standalone Node on `:8790`, no WP, no live API |
| UX shape | Embeddable **tool** (form → chart → readings), not a marketing landing page |
| Privacy | No DOB in URLs, share text, or analytics; nothing persisted |

Additional product improvements over the brainstorm:

1. **Reuse, don’t reinvent** — one shared calc path with personal + compatibility tools so a later merge stays consistent.
2. **Parent-first voice** with age-band language only (never developmental diagnosis).
3. **“Areas for Growth”** naming instead of “challenges/weaknesses.”
4. **Chart still renders if reading composition fails.**
5. **Single API call** returns calculation + chart + reading (second `/reading` endpoint unnecessary locally).
6. **Optional guardian name** for greeting copy only — never used in math or share blurb by default.

---

## Product shape

- Parent/guardian enters child name + date of birth (optional guardian name).
- Individual matrix uses the **same math** as the personal Destiny Matrix chart.
- Interactive SVG chart using the **same octagon / diamond geometry**.
- Full child symbolic profile from a **local interpretation engine** (energy × position).
- Language is supportive, non-deterministic, non-clinical, parent-oriented.

Positioning: *“A symbolic tool for exploring your child’s unique energy and encouraging thoughtful observation.”*

---

## Local run

- Own process and port: `http://127.0.0.1:8790/`
- Start: `./childrens-matrix/start.sh` or `node childrens-matrix/server.mjs`
- One request: `POST /api/children-matrix/calculate` returns calculation + chart payload + reading.
- Reuses the same reduction / matrix formulas as personal chart. Does not call the personal Generate Chart ajax path.

---

## Methodology

| Field | Value |
|---|---|
| Name | Destiny Matrix 22-energy children’s chart |
| Version | `destiny-matrix-22 / children-v1` |
| Chart map | `children-map-v1` (personal-chart geometry, child-facing labels) |
| Reduction | Identical to personal chart: if `n > 22` then `n = (n % 10) + Math.floor(n / 10)` (once) |
| Range | Energies **1–22** only. 22 is The Fool (not reduced to 4). Month 1–12 used as-is. |

`normalizeEnergy` = existing `reduceNumber`. Every child value comes from the personal matrix. The interpretation layer never reduces or invents numbers.

---

## Individual matrix (child)

Same as personal chart:

1. Parse DOB as `YYYY-MM-DD` (UI also accepts DD/MM/YYYY and validates calendar date).
2. `A = reduceNumber(day)`, `B = month`, `C = reduceNumber(sum of year digits)`.
3. Full `calculateMatrix(A, B, C)` → `points`, `purposes`, `years`, `chartHeart`.

Birth year window: not in the future, not older than 18 for the **child tool default** (soft warn above 17; still calculate if ≤ 25 for teen edge cases; reject > 25 with a clear message that this tool is for children/teens). Names trimmed, max 80 chars, no HTML.

Age is derived for **language tone only** (bands `0–5`, `6–9`, `10–13`, `14–17`, `18+`). Age never invents energies or predicts development.

---

## Child position map (`children-v1`)

Parent-facing ids mapped onto existing personal-chart keys:

| Position id | Title | Chart key | Why this vertex |
|---|---|---|---|
| `core` | Core Personality | `epoint` | Center / comfort zone |
| `expression` | How They Show Up | `apoint` | Day / portrait energy |
| `talents` | Natural Talents | `bpoint` | Month / higher-talent sky |
| `social` | Social Interaction | `cpoint` | Right / social task |
| `family` | Family Dynamic | `dpoint` | Earth / ancestral / home |
| `purpose` | Inner Direction | `perspurpose` | Personal destiny |
| `emotions` | Emotional Expression | `jpoint` | Love-line primary |
| `creativity` | Creativity & Imagination | `kpoint` | Love-line second / ideal expression |
| `learning` | Learning Tendencies | `tpoint` | Talent channel toward center |
| `communication` | Communication | `wpoint` | Heart channel |
| `motivation` | Motivation | `spoint` | Aspiration / inner expression |
| `growth` | Developmental Growth | `xpoint` | Soul-calling / heart’s desire |
| `challenge` | Areas for Growth | `rpoint` | Awareness point on the earth/love path |

Supporting triples (readings only — not extra invented numbers):

- Talent channel: `bpoint`, `tpoint`, `xpoint`
- Heart channel: `spoint`, `wpoint`, `epoint`
- Love / feeling line: `jpoint`, `kpoint`, `lpoint`
- Home / earth: `dpoint`, `rpoint`, `jpoint`

---

## Chart map (`children-map-v1`)

Fixed SVG, `viewBox="0 0 680 600"`, same frame as the personal chart:

- Outer octagon, axis-aligned square, rotated square, vertical + horizontal axes, male/female diagonals.
- Node coordinates copied from the personal chart.
- Age-cycle perimeter labels **omitted** (personal life-year chrome; child focus is the developmental reading set).
- Connections are the documented geometry lines only.
- Center node (`epoint` / Core) is visually dominant.
- Child-position labels sit beside the mapped vertices. Purpose is a header badge (`perspurpose`) because it is not an octagon vertex.

Renderer maps `position id + energy + fixed x/y`. Layout never depends on the number.

Click / keyboard: detail panel = position + energy + database text. Hover on desktop; tap on mobile. `prefers-reduced-motion` disables draw-in animation.

Calm premium visual language (soft gold / sky accents). Never use red as “bad energy.” Challenge nodes are not frightening.

---

## Interpretation (local engine, AI JSON contract)

No live model. A deterministic composer fills:

```json
{
  "overview", "corePersonality", "talents", "learning", "communication",
  "emotions", "creativity", "social", "motivation", "family",
  "growthAreas", "parentSupport", "finalSummary": {
    "coreTheme", "strength", "growthArea", "supportiveEnvironment", "reflection"
  }
}
```

Layers:

1. **Energy database** — 1–22 names, essence, gifts, shadows, child facets, parent cues.
2. **Position database** — titles, descriptions, parent prompts.
3. **Energy × position hooks** — unique first movement per cell so the same arcana is not copy-pasted across Learning vs Emotions.
4. **Age-band tone** — wording softens for 0–5 vs teens; never predicts milestones.
5. **Composer** — parent voice, no invented numbers, no diagnosis, no fear copy.

Tone phrases: “may suggest…”, “in the Destiny Matrix tradition…”, “parents may observe…”, “could be useful to explore…”.

If composition throws, the chart still renders and the UI shows: “The matrix was calculated successfully, but the detailed interpretation is temporarily unavailable.”

---

## UI (match personal-chart / compatibility tool quality)

Dark premium shell, expressive serif + clean sans, gold accents, same arcana fill colors as the personal SVG.

Flow (tool, not landing page):

1. Compact title + one-line disclaimer under the generate button.
2. Child input (name, DOB, optional guardian name) + **Generate Child’s Matrix**.
3. Loading steps that describe real work (parse date, calculate matrix, build chart, compose reading).
4. Results: child name (age band), core energy, interactive map, node panel, accordion reading sections, parent support, final summary, share/print, short disclaimer.

Share copies a short blurb (child first name + core energy only — **no DOB**). Print stylesheet included. Nothing persisted. No DOBs in query strings.

---

## API (local only)

`POST /api/children-matrix/calculate`

```json
{
  "child": { "name": "Emma", "birthDate": "2018-06-14" },
  "guardianName": ""
}
```

Response: `{ ok, methodology, chartVersion, child, matrix, positions, chart, reading }`.

---

## Privacy & safety (non-negotiable)

- No DOB in public URLs, share text, or analytics payloads.
- Do not store child profiles in v1.
- No medical, psychological, educational-placement, or predictive claims.
- If interpretation text would drift into diagnosis language, composer templates forbid it; validation rejects banned phrases.

---

## Tests

`node childrens-matrix/tests/run.mjs`

- Same DOB → same JSON every time.
- Leap day accepted / invalid day rejected.
- Future date rejected; missing name/DOB rejected.
- All thirteen positions present, energies 1–22.
- Chart nodes have coordinates; connections reference valid ids.
- Reference: Emma `2018-06-14` → core `epoint` **8**.

---

## Out of scope (on purpose)

- WordPress shortcode / plugin merge.
- Live Cloudflare Worker or Pages.
- Live LLM keys.
- Saving multiple child profiles.
- Parent + child compatibility module.
- Sibling compare.
- Merging this UI into `index.html` on port 8788.

---

## File map

```text
childrens-matrix/
  plan.md                 ← working copy of this document
  source-spec.md          ← original brainstorm (unchanged)
  README.md
  start.sh
  server.mjs              ← :8790
  index.html
  css/app.css
  js/app.js
  engine/                 ← calc, positions, chart, facets, composer
  data/energies.json
  tests/run.mjs
```

---

## Later merge path

When merging with the main Destiny Matrix tool:

1. Keep `children-v1` methodology version stable.
2. Share `reduceNumber` / `calculateMatrix` from `tools/local-api/calc.js`.
3. Register a separate shortcode / route; do not overload personal Generate Chart.
4. Revisit live AI only behind the same safety prompt + JSON schema; keep local composer as fallback.
