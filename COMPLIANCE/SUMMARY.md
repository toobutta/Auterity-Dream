# Compliance Risk Summary

## Top Risks
1. **No project license** – repository lacks a LICENSE file. Without an explicit license, code is "All Rights Reserved" and cannot be reused or distributed.
2. **PyMuPDF 1.23.8 (AGPL-3.0)** – strong copyleft license requiring source disclosure for network use. High risk for SaaS distribution.
3. **LGPL packages in systems/neuroweaver/frontend** – LGPL-3.0 components may impose reciprocal obligations when modified or statically linked.
4. **Unscanned dependencies** – due to tooling limitations, SBOM and license scans may be incomplete.
5. **Missing SPDX headers** – many source files do not contain SPDX-License-Identifier headers.
6. **No policy enforcement** – prior to this commit, CI lacked license policy checks.
7. **Vendored node_modules** – inclusion of full dependency trees increases attack surface and compliance scope.
8. **Transitive dependencies with unknown licenses** – manifests reference packages without explicit license metadata.
9. **Potential redistribution of AGPL components** – if binaries or containers are distributed, AGPL obligations extend to recipients.
10. **Outdated dependency versions** – some components may have known vulnerabilities or licensing changes.

## Recommended Actions
- Add an explicit project license (e.g., Apache-2.0 or MIT).
- Replace PyMuPDF with permissive alternatives (`pdfminer.six`, `PyPDF2`).
- Review LGPL components; ensure dynamic linking and provide source for modifications.
- Run full scans in a network-enabled environment to refresh SBOM and notices.
- Add SPDX headers to all source files.
- Monitor dependency updates for licensing changes.
