# GitHub Actions example

`licence-policy.yml` is a complete workflow. Copy it to `.github/workflows/licence-policy.yml`,
commit your policy and your component records, and every pull request gets a deterministic licence
policy check.

```bash
npm install --save-dev @wardenkit/open-source-licence-policy
mkdir -p .github/workflows
cp licence-policy.yml .github/workflows/licence-policy.yml
```

This calls the CLI directly with `npx --no-install`. **There is no WardenKit GitHub Action** to
install from the marketplace; the CLI inside the npm package is the supported integration, and
`npm ci` plus your lockfile is what pins the SPDX baseline for the run.

## What the workflow does

1. `reference --json` records the SPDX License List version, specification version and content
   hashes that decided the run, in the job log.
2. `validate-policy --json` fails the job before evaluation if the policy document is invalid, so a
   malformed policy is never mistaken for a clean licence result.
3. `evaluate --json --output licence-policy-result.json` evaluates your components against your
   policy and exits `1` when an outcome listed in your own `ciFailureOutcomes` occurs.
4. `upload-artifact` with `if: always()` keeps the result JSON even on failure, which is the part you
   actually read when a build is blocked.

## Adapting it

- **Required check:** add this workflow to your branch protection required checks so a blocked
  licence outcome stops a merge.
- **Warn instead of block:** remove `policy-denied` from your `ciFailureOutcomes`… but note that a
  valid policy must always list `policy-denied`. To warn without failing, keep the step and add
  `continue-on-error: true` to the evaluate step instead, then read the artefact.
- **Generating component records:** insert your own step before the evaluate step. This product does
  not discover dependencies or detect licences; it evaluates the machine-readable evidence you
  supply.
- **Monorepos:** run the evaluate step once per package with a matrix, giving each a distinct
  `--output` path and artefact name.
- **Air-gapped or self-hosted runners:** nothing changes. Evaluation makes no network request, so
  only the `npm ci` step needs registry access.
- **Permissions:** the workflow requests `contents: read` only. No token, secret or credential is
  needed for evaluation.
