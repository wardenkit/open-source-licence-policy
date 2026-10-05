# Customer-authored policy examples

Three complete, valid policy documents. Each is an illustration of a decision a *customer* might
make. WardenKit does not recommend which licences you should allow, deny or send to review, and
none of these files is guidance about what your policy ought to say.

Validate any of them before use:

```bash
npx wardenkit-licence-policy validate-policy --policy allowlist-strict.json --json
```

| File | Posture |
| --- | --- |
| `allowlist-strict.json` | Deny by default. Only five explicitly named identifiers are allowed; complex expressions, deprecated identifiers and anything unmatched fail CI. |
| `review-first.json` | Review by default. Nothing is denied outright, so unmatched components queue for human triage while denials and unknown expressions still stop a release. |
| `dual-licence-and-exceptions.json` | Matches whole normalized expressions: dual-licence choices and a `WITH` exception are treated as first-class cases. |

## The five fields that shape every outcome

| Field | Effect |
| --- | --- |
| `defaultOutcome` | Applied when no rule matches. `policy-denied` gives you an allowlist; `review-required` gives you a triage queue. |
| `complexExpressionTreatment` | Applied to a multi-operand expression that no `exact-normalized-expression` rule matched. |
| `deprecatedIdTreatment` | `review-required`, `policy-denied`, or `treat-as-listed` to let the rules decide as normal. |
| `ciFailureOutcomes` | Which outcomes set `aggregate.ciBlocking` and make the CLI exit `1`. Must always include `policy-denied`; a policy that omits it is rejected with `POLICY_CI_FAILURE_OUTCOMES_INVALID`. |
| `rules` | Explicit decisions, matched by `exact-license-id`, `exact-license-ref` or `exact-normalized-expression`. |

## Matching rules correctly

- `exact-license-id` matches a single listed SPDX identifier, for example `Apache-2.0`.
- `exact-license-ref` matches a custom reference. References normalize to lower case, so write
  `LicenseRef-acme-internal`, not `LicenseRef-Acme-Internal`.
- `exact-normalized-expression` matches a whole expression **in canonical normalized form**. A
  non-canonical rule expression is rejected with `POLICY_EXPRESSION_NOT_CANONICAL` at validation
  time, so a silently-never-matching rule cannot reach production.

Canonical form orders the operands of the commutative `AND` and `OR` operators, so write
`Apache-2.0 OR MIT` rather than `MIT OR Apache-2.0`. Check any expression first:

```bash
node -e "import('@wardenkit/open-source-licence-policy').then(m => console.log(m.createEvaluator().normalizeExpression('MIT or apache-2.0')))"
```

Duplicate rule identifiers, duplicate matches and conflicting rules are reported as
`POLICY_DUPLICATE_RULE`, `POLICY_DUPLICATE_MATCH` and `POLICY_CONFLICTING_RULES`. A policy is a
reviewable artefact: commit it, version it with `policyVersion`, and read the `policyHash` recorded
in every result to know exactly which policy produced it.
