# Children's Destiny Matrix (standalone)

Parent-facing Destiny Matrix tool for a child's birth date. Same 22-energy math and SVG geometry as the personal chart. Local interpretation composer — no WordPress, no live API, no LLM.

## Run

```bash
./start.sh
# → http://127.0.0.1:8790/
```

Health: `http://127.0.0.1:8790/health`

## API

`POST /api/children-matrix/calculate`

```json
{ "child": { "name": "Emma", "birthDate": "2018-06-14" }, "guardianName": "" }
```

## Tests

```bash
node tests/run.mjs
```

## Notes

- Methodology: `destiny-matrix-22 / children-v1`
- Chart map: `children-map-v1` (`viewBox 0 0 680 600`)
- Intended to live beside `compatibility/` in the v2 tree; not merged into the personal chart yet
- See `plan.md` for locked decisions vs the original brainstorm (`source-spec.md`)
