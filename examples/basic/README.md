# Basic local evaluation

Evaluate a policy you author over component records you supply, entirely in your own process.

```bash
npm install @wardenkit/open-source-licence-policy
node check-licences.mjs
```

The same run through the CLI:

```bash
npx wardenkit-licence-policy validate-policy --policy licence-policy.json --json
npx wardenkit-licence-policy evaluate \
  --components components.json \
  --policy licence-policy.json \
  --json
```

## Files

| File | Role |
| --- | --- |
| `licence-policy.json` | The policy — yours to author, own and version. |
| `components.json` | The component records — one SPDX licence expression per component. |
| `check-licences.mjs` | Local SDK evaluation using `validatePolicy` and `createEvaluator`. |

## What the example inputs demonstrate

| Component | Expression | Outcome | Why |
| --- | --- | --- | --- |
| `left-pad` | `MIT` | `policy-allowed` | Matched rule `allow-mit`. |
| `acme-http` | `Apache-2.0 OR MIT` | `policy-allowed` | Matched rule `allow-apache-or-mit-dual` on the canonical normalized expression. |
| `acme-internal-utils` | `LicenseRef-Acme-Internal` | `policy-allowed` | Custom reference, normalized to `LicenseRef-acme-internal` and matched by rule. |
| `copyleft-tool` | `AGPL-3.0-only` | `policy-denied` | Matched rule `deny-agpl-3.0-only`. |
| `legacy-lib` | `LGPL-2.1` | `review-required` | Deprecated identifier, handled by `deprecatedIdTreatment`. |
| `mystery-lib` | `Totally-Made-Up-1.0` | `invalid-unsupported` | Not in the pinned SPDX License List. |

Aggregate: `invalid-unsupported`, `ciBlocking: true`, exit code `1` — because this policy lists
`policy-denied` and `invalid-unsupported` in its own `ciFailureOutcomes`.

The licence identifiers above illustrate a *customer-authored* policy. WardenKit does not recommend
which licences you should allow, deny or review; that decision is yours.

## Try changing it

- Remove `deny-agpl-3.0-only` and see `copyleft-tool` fall through to `defaultOutcome`.
- Set `deprecatedIdTreatment` to `treat-as-listed` and see `legacy-lib` be decided by the rules
  instead.
- Drop `invalid-unsupported` from `ciFailureOutcomes` and see the exit code change while the
  per-component result stays the same.
- Break an expression on purpose — `"MIT And Apache-2.0"` — and read the `EXPR_SYNTAX` diagnostic.
