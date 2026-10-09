# Generic CI example

`check-licences.sh` runs the licence policy check on any CI system that provides a POSIX shell and
Node.js 22.x or 24.x (the package's supported runtimes) — GitLab CI, CircleCI, Jenkins, Buildkite, Azure Pipelines, a Makefile target, or
a local pre-release script.

```bash
npm install --save-dev @wardenkit/open-source-licence-policy
POLICY_FILE=licence-policy.json COMPONENTS_FILE=components.json sh check-licences.sh
```

The script validates the policy first, then evaluates, then writes the JSON result to
`licence-policy-result.json` and exits with the CLI's own exit code.

## Exit codes

| Code | Meaning | Typical CI handling |
| --- | --- | --- |
| `0` | No blocking outcome. | Pass. |
| `1` | An outcome listed in your own `ciFailureOutcomes` occurred. | Fail the build; the result file names the components. |
| `2` | Invalid usage, or an invalid policy or component document. | Fail the build; this is a pipeline defect, not a licence finding. |
| `3` | Not authorized for the requested reference pack. | Fail; check the entitlement or drop back to the bundled snapshot. |
| `4` | Trust verification failed on a signed artefact. | Fail hard and investigate; never bypass. |
| `5` | Network failure during `activate` or `refresh` only. | Retry that step; evaluation itself never needs the network. |
| `6` | Perimeter rejected the request. | Fail; check the activation state. |

## Notes for pipeline authors

- Use `npx --no-install` as the example does, so a missing dev dependency fails loudly instead of
  silently resolving an unpinned package from the network at build time.
- Keep `--output` and upload the result JSON as a build artefact. It records `policyHash`,
  `policyId`, `policyVersion` and the reference version, so a result stays attributable to the exact
  policy and SPDX baseline that produced it.
- Evaluation is deterministic: the same components, the same policy and the same reference version
  always produce the same result, which makes the artefact suitable as release evidence.
- Run this after whatever step produces your component records. Producing them is your job — this
  product does not discover dependencies or detect licences, it evaluates the evidence you supply.
- Exit code `1` is a policy decision you configured. Change the decision by changing your policy, not
  by ignoring the exit code.
- No cache, no daemon and no service is required. `evaluate`, `validate-policy`, `reference` and
  `status` make no network requests.
