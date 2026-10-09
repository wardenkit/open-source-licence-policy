# Basic local evaluation

Evaluate a policy you author over component records you supply, entirely in your own process.

From a clone of this repository:

```bash
cd examples/basic
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

## Expected output

Unedited output with `@wardenkit/open-source-licence-policy` `0.1.1` (exit code `1`):

```text
policy example-basic-licence-policy@1.0.0 hash b52e45c0d66243c50f20b4e3434212c913fd35843228b61c73961e11b924c318
policy-allowed       acme-http (Apache-2.0 OR MIT) decided by rule
policy-allowed       acme-internal-utils (LicenseRef-acme-internal) decided by rule
policy-denied        copyleft-tool (AGPL-3.0-only) decided by rule
policy-allowed       left-pad (MIT) decided by rule
review-required      legacy-lib (LGPL-2.1) decided by deprecatedIdTreatment
  EXPR_DEPRECATED_ID: SPDX licence identifier "LGPL-2.1" is deprecated.
invalid-unsupported  mystery-lib (mystery-lib) decided by grammar
  EXPR_UNKNOWN_ID: Unknown SPDX licence identifier "Totally-Made-Up-1.0".

aggregate: invalid-unsupported over 6 components
counts: {"policy-allowed":3,"policy-denied":1,"review-required":1,"invalid-unsupported":1}
product 0.1.1 · reference spdx-license-list-3.28.0/snapshot-1
SPDX List 3.28.0 · spec 3.0.1
licence policy: blocking outcome
```

## Try changing it

- Remove `deny-agpl-3.0-only` and see `copyleft-tool` fall through to `defaultOutcome`.
- Set `deprecatedIdTreatment` to `treat-as-listed` and see `legacy-lib` be decided by the rules
  instead.
- Drop `invalid-unsupported` from `ciFailureOutcomes` and see the exit code change while the
  per-component result stays the same.
- Break an expression on purpose — `"MIT And Apache-2.0"` — and read the `EXPR_SYNTAX` diagnostic.
