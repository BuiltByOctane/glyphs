## Summary

<!-- 1-3 sentences. What does this change do, and why? -->

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor (no behavior change)
- [ ] Docs / chore
- [ ] Other (please describe)

## Linked issues

<!-- Closes #123, refs #456 -->

## Testing notes

<!-- How did you verify this works? Manual steps you ran, edge cases checked, screen capture for UI changes. -->

## Pre-merge checklist

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `cd src-tauri && cargo check` passes
- [ ] `cd src-tauri && cargo clippy --all-targets` passes (no new warnings)
- [ ] Manually tested the affected paths in `npm run tauri:dev`
- [ ] For UI changes: screenshot or recording attached above
- [ ] For new settings: defaults documented and persisted across restart
- [ ] For new permissions: capability added to `src-tauri/capabilities/default.json`

## Notes for reviewers

<!-- Anything that would have taken you 10 minutes to figure out from the diff alone. -->
