# Security policy

## Reporting a vulnerability

Report suspected vulnerabilities in the `@wardenkit/open-source-licence-policy` package, or in the
examples in this repository, by email to **security@wardenkit.com**.

Please include, where you can:

- the package version (`npm ls @wardenkit/open-source-licence-policy`) and Node.js version;
- the affected command or API surface;
- a minimal reproduction — a component-record document, a policy document and the exact command;
- the observed behaviour and the behaviour you expected.

Do **not** open a public issue for a suspected vulnerability, and do not include real customer
data, credentials or activation codes in a report. Synthetic reproduction data is always sufficient
for this product.

You will receive an acknowledgement of your report. Please allow a reasonable period for a fix to
be prepared and released before disclosing details publicly.

## Scope

In scope:

- expression parsing, normalization and policy evaluation producing incorrect or non-deterministic
  results for well-formed input;
- input handling that crashes the process, exhausts memory, or escapes the documented bounded-size
  and strict-schema limits;
- any unexpected network request from `evaluate`, `validate-policy`, `reference` or `status`, all of
  which must make none;
- any transmission of component records, policies, dependency names or results, none of which is
  ever transmitted;
- incorrect verification of a signed entitlement or a signed WardenKit Licence Reference Pack,
  including acceptance of an unsigned, mis-signed, expired or product-mismatched artefact;
- writes outside the local artefact cache directory.

Out of scope:

- the SPDX License List content itself, which is upstream third-party technical data;
- a policy decision you configured — which licences your policy allows, denies or reviews is your
  own decision, and an outcome you disagree with is not a vulnerability;
- absence of a capability the product explicitly does not have, including dependency discovery,
  licence detection, SBOM parsing and vulnerability scanning;
- imperfect technical enforcement of commercial repository or client-organization limits, which are
  contractual licence rights and are not technically metered.

## Supported versions

Security fixes are released for the current published version of the package; older versions are
not patched. Keep `@wardenkit/open-source-licence-policy` on its latest release.

## Cryptographic material

Signed entitlements and signed WardenKit Licence Reference Packs are verified locally with Ed25519
against public keys shipped inside the package. Only public verification keys are ever distributed.
If you believe a WardenKit public key or a signed artefact is incorrect, report it to the address
above rather than opening a public issue.
