#!/usr/bin/env sh
# Licence policy check for any CI system that can run a POSIX shell and Node.js 22.x or 24.x.
#
#   sh examples/ci/check-licences.sh
#
# Inputs (override with environment variables):
#   POLICY_FILE      path to your policy document
#   COMPONENTS_FILE  path to your component records
#   RESULT_FILE      where the JSON result is written for artefact upload
#
# Exit codes are the CLI's own:
#   0 pass · 1 blocking outcome · 2 usage or invalid input · 3 authorization
#   4 trust · 5 network · 6 perimeter
#
# Nothing here contacts the network: evaluate, validate-policy, reference and
# status all run locally.

set -eu

POLICY_FILE="${POLICY_FILE:-licence-policy.json}"
COMPONENTS_FILE="${COMPONENTS_FILE:-components.json}"
RESULT_FILE="${RESULT_FILE:-licence-policy-result.json}"

CLI="npx --no-install wardenkit-licence-policy"

echo "== licence policy: reference baseline =="
$CLI reference --json

echo "== licence policy: validating $POLICY_FILE =="
# Fail before evaluation if the policy you own is not a valid policy document.
$CLI validate-policy --policy "$POLICY_FILE" --json

echo "== licence policy: evaluating $COMPONENTS_FILE =="
set +e
$CLI evaluate \
  --components "$COMPONENTS_FILE" \
  --policy "$POLICY_FILE" \
  --output "$RESULT_FILE" \
  --json
STATUS=$?
set -e

echo "== licence policy: result written to $RESULT_FILE (exit $STATUS) =="

case "$STATUS" in
  0)
    echo "licence policy: no blocking outcome"
    ;;
  1)
    echo "licence policy: blocked by your policy — see $RESULT_FILE" >&2
    ;;
  2)
    echo "licence policy: invalid usage or invalid input document" >&2
    ;;
  *)
    echo "licence policy: failed with exit code $STATUS" >&2
    ;;
esac

# Always keep the result as a build artefact, then propagate the CLI exit code.
exit "$STATUS"
