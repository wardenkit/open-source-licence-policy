# Changelog

All notable changes to this examples and documentation repository are recorded here. The changelog
of the SDK itself is distributed inside the `@wardenkit/open-source-licence-policy` package.

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) ordering conventions.
Dates are UTC.

## Unreleased

### Changed

- Documentation only; still written against `@wardenkit/open-source-licence-policy` `0.1.1`. The
  README opens with direct links to free local evaluation, the runnable example, the CI examples,
  real results, paid-plan value and pricing, and the documentation and guides. It now includes
  the unedited output of `examples/basic/` on `0.1.1` and the full clone-install-run steps. The
  generic CI example states the supported Node.js runtimes (`22.x` or `24.x`) exactly.

## 0.1.1

### Changed

- Documentation and examples now track `@wardenkit/open-source-licence-policy` version `0.1.1`, a
  patch release: `activate` prompts for the Activation Code in an interactive terminal without
  echoing it, and the CLI and managed Production evaluator use the WardenKit commercial perimeter
  by default. The six-export SDK surface, the six CLI commands and the examples are unchanged.

## 0.1.0

### Added

- Initial documentation and examples for `@wardenkit/open-source-licence-policy` version `0.1.0`:
  README with the SPDX expression, result-model and CLI reference; minimal local SDK evaluation
  example; customer-authored policy examples; a generic CI shell example; and a GitHub Actions
  workflow example.
- README reference for the six-export SDK surface, including the managed Production evaluator
  (`createManagedProductionEvaluator`: signed 72-hour authorization refreshed on evaluate activity,
  bounded retry, `REVALIDATION_REQUIRED` and `PAYMENT_RECOVERY` states), the full network and data
  boundary, and the free / Production / Platform-Agency plan table.

### Notes

- Versions of this repository track the `@wardenkit/open-source-licence-policy` package version the
  examples are written against. The package itself is installed from npm; this repository ships no
  SDK source.
