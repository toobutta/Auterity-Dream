# Compliance Risk Summary

## Top Risks
1. **PyMuPDF 1.23.8 (AGPL-3.0)** – strong copyleft license requiring source disclosure for network use. High risk for SaaS distribution.
2. **LGPL packages in systems/neuroweaver/frontend** – LGPL-3.0 components may impose reciprocal obligations when modified or statically linked.
3. **Unscanned dependencies** – due to tooling limitations, SBOM and license scans may be incomplete.
4. **Missing SPDX headers** – many source files do not contain SPDX-License-Identifier headers.
5. **No policy enforcement** – prior to this commit, CI lacked license policy checks.
6. **Vendored node_modules** – inclusion of full dependency trees increases attack surface and compliance scope.
7. **Transitive dependencies with unknown licenses** – manifests reference packages without explicit license metadata.
8. **Potential redistribution of AGPL components** – if binaries or containers are distributed, AGPL obligations extend to recipients.
9. **Outdated dependency versions** – some components may have known vulnerabilities or licensing changes.

## Recommended Actions
- Replace PyMuPDF with permissive alternatives (`pdfminer.six`, `PyPDF2`).
- Review LGPL components; ensure dynamic linking and provide source for modifications.
- Run full scans in a network-enabled environment to refresh SBOM and notices.
- Add SPDX headers to all source files.
- Monitor dependency updates for licensing changes.
