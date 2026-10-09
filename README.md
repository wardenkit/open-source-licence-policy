# Open-source licence policy as code

**Turn your licence policy into an enforceable build rule.**

Give WardenKit your software-component list and your licence rules. It validates SPDX licence
evidence locally and fails CI when a component breaks your policy—without uploading your repository
to a heavyweight SCA platform.

**Local-first · SPDX-native · Deterministic · CI-ready**

```sh
npm install @wardenkit/open-source-licence-policy
```

**Using GitHub? [Add WardenKit to GitHub Actions →](examples/github-actions/)**

- **Try it free:** [60-second local evaluation](#60-second-local-evaluation) — no account, email,
  card or licence key.
- **Runnable example:** [`examples/basic/`](examples/basic/) — the SDK and the CLI over a sample
  policy and six component records.
- **CI:** [GitHub Actions workflow](examples/github-actions/) · [any other CI](examples/ci/)
- **Real results:** [what the example prints on `0.1.1`](#real-policy-results)
- **Production and Platform / Agency:** [what the paid plans add](#free-evaluation-and-paid-production-use)
  · [pricing](https://wardenkit.com/products/open-source-licence-policy/#pricing) — Production
  $49/month; Platform / Agency $149/month.
- **Docs:** [Documentation and quickstart](https://wardenkit.com/docs/open-source-licence-policy/)
  · [Guides](#documentation-and-guides)
- Package: `@wardenkit/open-source-licence-policy` · CLI: `wardenkit-licence-policy`

**Boundaries.** This repository holds public documentation and examples; the SDK is distributed
through npm. It is not SCA: no dependency discovery, no license detection and no telemetry. It
evaluates the component records and policy you supply and gives no legal advice.

## About this repository

Runnable examples and reference material for the WardenKit **Open-Source Licence Policy SDK** —
open source license policy as code: a local Node.js SDK and CLI that validates and normalizes
**SPDX** license expressions against a pinned SPDX License List baseline, evaluates a policy **you**
author over component records **you** supply, and returns reproducible, CI-consumable JSON.
Everything runs in your own process; there is no hosted evaluator.

> **Version.** The examples and reference in this repository are written against the public surface
> of `@wardenkit/open-source-licence-policy` version `0.1.1`. This repository contains documentation
> and examples only; the SDK source is not distributed here.

## What problem this solves

Most teams already know which licenses they are willing to ship. What they lack is a deterministic,
reviewable way to *state* that decision and *enforce* it in CI:

- a license policy that lives in the repository as code, is versioned, and is hashed into every
  result;
- SPDX license expressions (`MIT`, `Apache-2.0 OR MIT`, `GPL-3.0-only WITH Classpath-exception-2.0`,
  `LicenseRef-acme-internal`) validated against a published SPDX List release rather than by string
  comparison;
- one command in CI that exits non-zero when the policy says the release must stop;
- output you can attach to a release as evidence, reproducible byte for byte.

This SDK does exactly that and nothing more. It never tells you which licenses to allow or deny, and
it produces no legal advice, permission, obligation or compatibility opinion.

## Install

```bash
npm install @wardenkit/open-source-licence-policy
```

Supported runtimes: Node.js 22.x and 24.x.

## 60-second local evaluation

No account, no email address, no license key, no network call.

```bash
git clone https://github.com/wardenkit/open-source-licence-policy.git
cd open-source-licence-policy/examples/basic
npm install @wardenkit/open-source-licence-policy
node check-licences.mjs
```

The run exits `1` on purpose: the sample policy blocks two of the six sample components. See
[Real policy results](#real-policy-results) for the exact output.

Or with the CLI directly:

```bash
npx wardenkit-licence-policy validate-policy --policy licence-policy.json --json
npx wardenkit-licence-policy evaluate \
  --components components.json \
  --policy licence-policy.json \
  --json
```

Two inputs, both yours:

`licence-policy.json` — your policy, as code:

```json
{
  "policySchemaVersion": 1,
  "policyId": "example-licence-policy",
  "policyVersion": "1.0.0",
  "defaultOutcome": "review-required",
  "complexExpressionTreatment": "review-required",
  "deprecatedIdTreatment": "review-required",
  "ciFailureOutcomes": ["policy-denied", "invalid-unsupported"],
  "rules": [
    { "ruleId": "allow-mit", "match": { "type": "exact-license-id", "licenseId": "MIT" }, "outcome": "policy-allowed" }
  ]
}
```

`components.json` — the license evidence you already have:

```json
[
  { "id": "left-pad", "version": "1.3.0", "licenseExpression": "MIT" },
  { "id": "copyleft-tool", "version": "2.0.0", "licenseExpression": "AGPL-3.0-only" }
]
```

The license identifiers in every example are illustrations of a *customer-authored* policy. Which
licenses your organization allows, denies or sends to review is your decision.

## Real policy results

Unedited output of `node check-licences.mjs` in [`examples/basic/`](examples/basic/) with
`@wardenkit/open-source-licence-policy` `0.1.1` on Node.js 22 and 24 (identical on both):

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

Exit code `1`: this sample policy lists `policy-denied` and `invalid-unsupported` in its own
`ciFailureOutcomes`. The same inputs through
`npx wardenkit-licence-policy evaluate --components components.json --policy licence-policy.json --output licence-policy-result.json --json`
write a JSON result. An excerpt:

```json
{
  "aggregate": {
    "outcome": "invalid-unsupported",
    "componentCount": 6,
    "ciBlocking": true,
    "counts": { "policy-allowed": 3, "policy-denied": 1, "review-required": 1, "invalid-unsupported": 1 }
  },
  "components": [
    {
      "id": "copyleft-tool",
      "normalizedExpression": "AGPL-3.0-only",
      "shape": "listed-id",
      "outcome": "policy-denied",
      "decidedBy": "rule",
      "matchedRuleId": "deny-agpl-3.0-only"
    }
  ],
  "provenance": {
    "productVersion": "0.1.1",
    "policyId": "example-basic-licence-policy",
    "policyHash": "b52e45c0d66243c50f20b4e3434212c913fd35843228b61c73961e11b924c318",
    "reference": { "referenceVersion": "spdx-license-list-3.28.0/snapshot-1", "spdxLicenseListVersion": "3.28.0" }
  }
}
```

These are results of a sample, customer-authored policy over sample component records, not a
recommendation about which licenses to allow.

## Result model

Per component, the policy produces exactly one of four outcomes. The `policy-` prefix means "the
result of your configured policy" — never a legal permission or prohibition.

| Outcome | Meaning |
| --- | --- |
| `policy-allowed` | Your policy allows this normalized expression. |
| `policy-denied` | Your policy denies it, by an explicit rule or by your `defaultOutcome`. |
| `review-required` | Your policy routes it to human review. |
| `invalid-unsupported` | The expression is malformed, unknown, or uses an unsupported construct. It never silently passes. |

`aggregate.ciBlocking` is derived from your own `ciFailureOutcomes` list, and the CLI exit code
mirrors it. Every result carries a `provenance` block — product version, schema versions, your
`policyId`, `policyVersion` and `policyHash`, a hash of the component input, and the exact SPDX
reference version — so identical inputs reproduce byte-identical output.

## SPDX license expressions

Expressions are parsed against **SPDX Specification 3.0.1, Annex B** and resolved against a pinned
**SPDX License List 3.28.0** baseline.

| Expression | Normalized | Shape |
| --- | --- | --- |
| `mit` | `MIT` | `listed-id` |
| `apache-2.0 or mit` | `Apache-2.0 OR MIT` | `complex` |
| `MIT AND (Apache-2.0 OR BSD-3-Clause)` | `(Apache-2.0 OR BSD-3-Clause) AND MIT` | `complex` |
| `gpl-3.0-only WITH Classpath-exception-2.0` | `GPL-3.0-only WITH Classpath-exception-2.0` | `complex` |
| `LicenseRef-Acme-Internal` | `LicenseRef-acme-internal` | `license-ref` |

- Operators `AND`, `OR`, `WITH` are matched case-sensitively (lowercase forms are also accepted);
  identifiers are matched case-insensitively and re-emitted in canonical List case.
- `AND` and `OR` are commutative, so operands are ordered canonically: two engineers writing the
  same choice differently get the same normalized expression.
- Deprecated identifiers are preserved exactly and reported with an `EXPR_DEPRECATED_ID` diagnostic.
  No successor identifier is ever substituted for you.
- `LicenseRef-<id>` and `AdditionRef-<id>` are supported as opaque customer-defined references with
  no legal meaning attached.
- `DocumentRef-`qualified references are unsupported in this version and produce
  `EXPR_DOCUMENTREF_UNSUPPORTED`.

SPDX is referenced as a technical standard family. WardenKit is not affiliated with, endorsed by or
operated by SPDX or the Linux Foundation.

## SDK surface

The package root exposes exactly six runtime exports:

```ts
import {
  LicencePolicyError,
  PRODUCT_VERSION,
  createEvaluator,
  createManagedProductionEvaluator,
  getEntitlementStatus,
  validatePolicy,
} from "@wardenkit/open-source-licence-policy";

const evaluator = createEvaluator();            // synchronous, deterministic, zero-network
const result = evaluator.evaluate({ policy, components });
validatePolicy(policy);
getEntitlementStatus();                         // local entitlement state, no network

// Production only: managed authorization refreshed on evaluate activity
const managed = await createManagedProductionEvaluator();
const outcome = await managed.evaluate({ policy, components });
managed.status().state;                         // AUTHORIZATION_ACTIVE | AUTHORIZATION_REFRESH_DUE | ...
```

`createEvaluator` never touches the network. `createManagedProductionEvaluator` is the only
network-capable SDK entry point: it performs a bounded HTTPS authorization refresh against the
WardenKit perimeter on evaluate activity and still evaluates locally.

## CLI

Six commands. JSON on stdout, diagnostics on stderr. Of the CLI commands only `activate` and
`refresh` use the network.

| Command | Flags |
| --- | --- |
| `evaluate` | `--components`, `--policy`, `--reference-pack`, `--output` |
| `validate-policy` | `--policy` |
| `reference` | `--reference-pack` |
| `status` | — |
| `activate` | `--activation-code`, `--activation-file` |
| `refresh` | — |

Global flags: `--json`, `--state-dir`.

| Exit code | Meaning |
| --- | --- |
| `0` | Success; for `evaluate`, an outcome that is not CI-blocking. |
| `1` | Evaluation completed and the aggregate outcome is CI-blocking under your policy. |
| `2` | Usage error, malformed input document or invalid policy. |
| `3` | Production authorization required, not yet valid, or expired. |
| `4` | Local trust state or reference pack rejected. |
| `5` | Network request to the WardenKit service failed. |
| `6` | The WardenKit perimeter rejected the request. |

## Examples in this repository

| Path | What it shows |
| --- | --- |
| [`examples/basic/`](examples/basic/) | Minimal local SDK evaluation with `createEvaluator()`, plus the same run through the CLI. |
| [`examples/policies/`](examples/policies/) | Customer-authored policy documents: strict allowlist, review-first, and dual-license handling. |
| [`examples/ci/`](examples/ci/) | A generic CI shell step that maps every exit code deliberately. |
| [`examples/github-actions/`](examples/github-actions/) | A GitHub Actions workflow that evaluates the policy and uploads the JSON result as an artifact. |

There is no WardenKit GitHub Action and none is required: the CI contract is the CLI exit code plus
the JSON result file.

## Documentation and guides

- [Documentation](https://wardenkit.com/docs/open-source-licence-policy/):
  [quickstart](https://wardenkit.com/docs/open-source-licence-policy/#quickstart) ·
  [CLI reference](https://wardenkit.com/docs/open-source-licence-policy/#cli) ·
  [reading the result](https://wardenkit.com/docs/open-source-licence-policy/#result) ·
  [running in CI](https://wardenkit.com/docs/open-source-licence-policy/#ci) ·
  [entitlement and activation](https://wardenkit.com/docs/open-source-licence-policy/#entitlement)
- [Open-source license policy as code](https://wardenkit.com/guides/open-source-license-policy-as-code/)
- [Use the WardenKit Licence Policy CLI in GitHub Actions](https://wardenkit.com/guides/use-the-wardenkit-licence-policy-cli-in-github-actions/)
- [Run license policy checks in CI](https://wardenkit.com/guides/run-license-policy-checks-in-ci/)
- [Validate SPDX license expressions in Node.js](https://wardenkit.com/guides/validate-spdx-license-expressions-in-node-js/)
- [SPDX license expression reference](https://wardenkit.com/guides/spdx-license-expression-reference/)

## Data boundary

- Component records, policies, dependency names, license evidence and results never leave your
  process.
- No telemetry. Nothing is counted, metered or reported.
- `evaluate`, `validate-policy`, `reference`, `status` and `createEvaluator` make no network request
  at all.
- `activate`, `refresh` and the managed Production evaluator's authorization refresh exchange only
  product identity, entitlement identity, tier, an organization subject identifier, an activation
  credential, timestamps and the product version — over HTTPS to the WardenKit perimeter only.
  Components, policies, SPDX expressions and evaluation results are never transmitted.

## Free evaluation and paid production use

Evaluation use — the full local evaluator against the bundled SPDX evaluation reference snapshot —
is free, requires no account and has no time limit. Production use requires a paid entitlement and
carries the maintained signed WardenKit Licence Reference Pack. Exact plans are on the
[product page](https://wardenkit.com/products/open-source-licence-policy/):

| Plan | Price | Rights |
| --- | --- | --- |
| Evaluation | $0 | Development, testing, CI integration testing and internal non-production evaluation. |
| Production | $49/month | One customer organization, up to 10 repositories, Production / Production-CI rights, maintained signed Licence Reference Pack, managed Production authorization and refresh, compatibility and security releases, documented support boundary. |
| Platform / Agency | $149/month | Up to 5 client organizations, up to 50 repositories aggregate, permitted production use on behalf of clients, the same maintained Production material. |

Each signed production authorization is valid for at most 72 hours. The managed Production evaluator
refreshes it on evaluate activity once 24 hours have passed — no daemon, no background timer, no
traffic while dormant — and the CLI `refresh` command is a recovery and diagnostic action. Only the
signed deadline is binding and there is no additional grace period. Transient service failures follow
a bounded retry ladder (5 min, 15 min, 1 h, 4 h, 8 h); an authorization that expires while the
service is unreachable performs two bounded recovery attempts and then reports
`REVALIDATION_REQUIRED` (a technical state, not a revocation), while evaluation of your files against
the bundled snapshot keeps working; a later `evaluate()` on the same evaluator begins a fresh bounded
recovery cycle, so a dormant or expired eligible installation revalidates automatically on its next
managed Production use and no routine daily manual refresh is required.
`managed.status().state` reports exactly one of `AUTHORIZATION_ACTIVE`, `AUTHORIZATION_REFRESH_DUE`,
`AUTHORIZATION_REFRESH_RETRY_SCHEDULED`, `REVALIDATION_REQUIRED`, `PAYMENT_RECOVERY` or
`COMMERCIAL_RIGHTS_ENDED`.
A subscription in provider-confirmed payment recovery (past due) keeps refreshing under
`PAYMENT_RECOVERY` until the payment provider reports a rights-changing event. Ordinary cancellation
keeps paid access through the period already paid for; cancellation, refund and the one-time
30-calendar-day initial-purchase guarantee are described in the
[Refund Policy](https://wardenkit.com/refund-policy/) and in the package's `LICENSE.md`.

## What this product does not do

- No dependency discovery — you supply the component records.
- No license detection or license-text classification.
- No vulnerability, malware or general SCA scanning.
- No SBOM generation; no SPDX-document or CycloneDX adapters in this version.
- No legal advice, legal permission or obligation determination, compatibility opinion or
  compliance certification.

## Support and licence

- Support: <support@wardenkit.com>
- Security: see [`SECURITY.md`](SECURITY.md)
- Licence for this repository's documentation and examples: [`LICENSE.md`](LICENSE.md). The SDK
  itself is licensed by the licence file shipped inside the published package.

WardenKit is a product of BRIDGER SERVICES (SMC-PRIVATE) LIMITED. WardenKit provides developer
tooling for evaluating and implementing compliance logic; it does not replace professional legal,
tax, or accounting judgment.
