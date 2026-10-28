# Bota CocoaPods Specs

Bota-maintained CocoaPods metadata for the [Bota App SDK](https://github.com/bota-dev/app-sdk).
The public index URL is `https://github.com/bota-dev/cocoapods-specs.git`.
It is a Bota source, not registration in the CocoaPods central Specs repository.
Customers requiring central registration must approve this source before migration.

Each Podspec names an exact SDK version and the SHA-256 of its immutable GitHub
release archive. SDK source and binaries remain in `bota-dev/app-sdk`; this
repository does not contain or rebuild them. Historical official CocoaPods
entries remain available from their original source.

## Installation

Add the Bota source to the app's Podfile, keeping the official source for unrelated
dependencies. Explicitly pin the selected SDK and its source:

```ruby
source 'https://github.com/bota-dev/cocoapods-specs.git'
source 'https://cdn.cocoapods.org/'

pod 'BotaAppSDK', '2.0.0-beta.22', :source => 'https://github.com/bota-dev/cocoapods-specs.git'
```

Run `pod install --repo-update`, retain the resulting `Podfile.lock`, and verify
that `SPEC REPOS` assigns `BotaAppSDK` to the Bota URL. A successful install that
fell back to the central source does not verify this migration. Select another
version only after confirming that exact entry exists here. Flutter installation
also needs the Bota source in the application's iOS Podfile; a plugin Podspec
does not configure the application's spec sources.

## Publication and immutability

Entries use `Specs/<pod-name>/<exact-version>/<pod-name>.podspec.json`.
`BotaAppSDK` is the 2.x name; historical 1.x entries retain `BotaAppleSDK`.
An absent `Specs/` directory is a valid empty index and advertises no versions.
The validator reports the actual entry count; scaffolding alone establishes no
published or installable SDK version.

The protected App SDK release publisher adds only metadata matching its approved
release archive. An existing version must match in full, otherwise publication
fails. New metadata first goes to a unique `publish/<run-id>-<attempt>` branch.
The publisher waits for **Validate Specs**, **License Gate** and **Scan** on that
exact commit, then fast-forwards `main` to the same SHA without a PR or bypass.
Do not amend, delete or rename an occupied version, force-push history,
reuse a version, or redirect it to a different payload. A timeout is not proof
that publication failed; inspect the existing entry before retrying.

The App SDK publisher receives `BOTA_COCOAPODS_SPECS_TOKEN` only in its protected
`release` environment. Use an approved fine-grained token restricted to
`bota-dev/cocoapods-specs`, with Contents write access and only the read permissions
required to observe its checks. An approved GitHub App integration may instead
supply a short-lived installation token for this repository at execution time.
The publisher uses HTTPS with a per-command credential helper; it must not
persist a user's general GitHub credential or add an SSH-key fallback.

Owners must provision the approved writer before automated publication can run,
and manage its expiration, rotation and revocation. A workflow secret reference
does not prove that a usable credential has been configured. Anonymous read
access to this public index requires no token. Never commit credentials or SDK
archives here.

## Validation

Use Node 22.23.2 and npm 11.17.0:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run license-check
npm run lint
npm run check
npm test
node scripts/validate-specs.mjs --base <full-previous-commit-sha>
```

This is a static metadata repository with zero external runtime/build dependencies
and no compilation step. The license gate refuses newly introduced dependencies
until its policy is deliberately reviewed. Installation uses the frozen lock
without an `npm install` fallback.

CI and security/license checks run on every branch, including publisher staging
branches, and on pull requests. Index CI validates every current entry and
compares committed Specs against the GitHub event's base/before SHA. Only newly
added version files pass. A new branch's zero `before` value compares against
its merge base with `origin/main`, so branch creation cannot hide edits to older
versions. Without a distinct remote `main`, manual/initial checks use the first
parent or the initial empty tree. Full Git history and a clean committed index
are required.

Repository owners must verify the integration-branch rules require **Validate
Specs**, **License Gate** and **Scan**, and protect against force pushes and branch
deletion. Workflow files do not prove that enforcement is configured. The App SDK
publisher must respect these rules; do not configure a review bypass merely to
make publication succeed.

These checks establish metadata shape and append-only changes. The App SDK release
gates separately verify archive bytes, source identities and clean Apple/Flutter
installation and compilation. Neither index validation nor publication proves
physical device behavior.

The repository's tooling is MIT-licensed. SDK Podspecs retain the SDK's
Apache-2.0 license declaration; this repository does not relicense SDK payloads.
