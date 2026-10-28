# Bota CocoaPods Specs maintenance

- This is an append-only metadata index. SDK implementation and archive generation
  belong in `bota-dev/app-sdk`; do not add SDK code or binaries here.
- Keep exact public names, version paths, immutable release URLs, source SHA-256
  and Apache-2.0 SDK license metadata. Never edit or remove an existing version.
- Use Node 22.23.2/npm 11.17.0 and frozen `npm ci --ignore-scripts`; this repository
  deliberately has no external dependencies or install hooks.
- Run `npm run license-check`, `npm run lint`, `npm run check`, `npm test`, and the
  committed-base append-only check before delivery. Retain full Git history in CI.
- Keep secrets in the owning protected release environment. Never weaken approval,
  source/checksum, branch rules, security analysis or occupied-version checks.
- Follow the owner's delivery preference for verified commits. AI-authored commits
  include `Co-Authored-By: OpenAI Codex <noreply@openai.com>`.
- Keep these instructions durable; do not append task logs or release receipts.
