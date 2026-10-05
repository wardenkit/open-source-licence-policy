// Minimal local evaluation with the WardenKit Open-Source Licence Policy SDK.
//
//   npm install @wardenkit/open-source-licence-policy
//   node check-licences.mjs
//
// Everything below runs in this process. No network request is made and nothing
// is transmitted. Exit code 1 means your policy blocked the run.

import { readFile } from "node:fs/promises";
import { createEvaluator, validatePolicy, PRODUCT_VERSION } from "@wardenkit/open-source-licence-policy";

const policy = JSON.parse(await readFile("licence-policy.json", "utf8"));
const components = JSON.parse(await readFile("components.json", "utf8"));

// 1. Validate the policy document you own before evaluating anything with it.
const policyCheck = validatePolicy(policy);
if (!policyCheck.valid) {
  for (const diagnostic of policyCheck.diagnostics) {
    console.error(`policy ${diagnostic.code}: ${diagnostic.message}`);
  }
  process.exit(2);
}
console.log(`policy ${policy.policyId}@${policy.policyVersion} hash ${policyCheck.policyHash}`);

// 2. Evaluate. No options means the bundled SPDX evaluation reference snapshot,
//    which needs no entitlement, no account and no licence key.
const evaluator = createEvaluator();
const outcome = evaluator.evaluate({ components, policy });

// 3. evaluate() returns a discriminated union: check ok before reading result.
if (!outcome.ok) {
  console.error(`${outcome.error.code}: ${outcome.error.message}`);
  for (const diagnostic of outcome.error.diagnostics) {
    console.error(`  ${diagnostic.code}: ${diagnostic.message}`);
  }
  process.exit(2);
}

const { aggregate, components: results, provenance } = outcome.result;

for (const component of results) {
  const expression = component.normalizedExpression ?? component.id;
  console.log(`${component.outcome.padEnd(20)} ${component.id} (${expression}) decided by ${component.decidedBy}`);
  for (const diagnostic of component.diagnostics) {
    console.log(`  ${diagnostic.code}: ${diagnostic.message}`);
  }
}

console.log("");
console.log(`aggregate: ${aggregate.outcome} over ${aggregate.componentCount} components`);
console.log(`counts: ${JSON.stringify(aggregate.counts)}`);
console.log(`product ${PRODUCT_VERSION} · reference ${provenance.reference.referenceVersion}`);
console.log(`SPDX List ${provenance.reference.spdxLicenseListVersion} · spec ${provenance.reference.spdxSpecVersion}`);

// 4. ciBlocking is derived from your own ciFailureOutcomes list.
if (aggregate.ciBlocking) {
  console.error("licence policy: blocking outcome");
  process.exitCode = 1;
}
