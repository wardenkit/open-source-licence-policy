# Changelog

All notable changes to this examples and documentation repository are recorded here. The changelog
of the SDK itself is distributed inside the `@wardenkit/open-source-licence-policy` package.

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) ordering conventions.
Dates are UTC.

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
