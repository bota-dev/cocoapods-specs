# Specs index ownership

The Bota App SDK owns source, compiled payloads, release approval, package identities
and artifact checksums. This repository owns only the public version-to-Podspec
index consumed by CocoaPods. Each entry references one immutable SDK release
archive and its nonzero SHA-256 digest.

The protected SDK publisher verifies its approved source and original artifacts,
then stages a previously absent version on a unique publication branch.
Occupied entries must match in full. The publisher waits for all three required
GitHub checks on the exact staging commit, then fast-forwards `main` to that SHA.
Normal Git publication preserves concurrent history; conflicts fail rather than
forcing an update. The SDK publisher uses HTTPS and a per-command credential
helper with the protected `BOTA_COCOAPODS_SPECS_TOKEN` value. Its approved writer
is restricted to this repository: a fine-grained token, or an installation token
supplied by an approved GitHub App integration. It does not persist a user's
general credential or bypass repository policy through an SSH deploy key.
Credential provisioning, expiry, rotation and revocation are operational gates;
checked-in configuration alone does not establish writer availability.

Index CI verifies canonical JSON, package/path identity, fixed release origins,
license metadata, absence of executable Podspec hooks, and append-only Specs
changes. Repository rules provide enforcement around these checks; their presence
must be verified separately from workflow source.

Consumers resolve the named SDK from this Bota source and verify the actual
`Podfile.lock` origin. The SDK release pipeline independently exercises clean
Apple and Flutter installs and builds. Metadata checks do not establish public
archive integrity, compiled SDK behavior or physical acceptance on their own.
