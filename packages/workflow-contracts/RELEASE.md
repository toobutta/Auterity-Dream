# Release process for @auterity/workflow-contracts

1. Bump the version in `package.json` (semver).
2. Run `npm ci` then `npm run build` to ensure `dist/workflow.schema.json` is up to date.
3. Commit changes and push a tag:

```bash
git add package.json CHANGELOG.md
git commit -m "chore(release): v1.0.0"
git tag v1.0.0
git push origin main --tags
```

4. GitHub Actions `publish-workflow-contracts.yml` will publish to GitHub Packages.

5. Update consuming repos to the new version.
