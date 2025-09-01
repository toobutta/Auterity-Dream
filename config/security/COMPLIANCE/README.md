# Compliance Artifacts

This directory contains generated Software Bill of Materials (SBOM), license scan results and attribution files for the project.

## Contents
- `SBOM.spdx.json` – SPDX 2.3 SBOM
- `bom.cdx.json` – CycloneDX 1.5 SBOM  
- `scancode.json` – License scan results
- `ATTRIBUTION.csv` – License and obligations matrix
- `THIRD_PARTY_NOTICES.md` – Human-readable notices
- `NOTICE` – Aggregate notice file
- `POLICY.yml` – License compliance policy

## Regeneration

To regenerate these artifacts:

```bash
scripts/compliance/install_tools.sh
scripts/compliance/generate_sbom.sh
scripts/compliance/scan_licenses.sh
scripts/compliance/evaluate_policy.sh
scripts/compliance/format_artifacts.sh
```

## License Policy

This project follows a permissive license policy allowing MIT, Apache-2.0, BSD, and similar licenses while prohibiting copyleft licenses like GPL and AGPL.
