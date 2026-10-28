import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'overrides', 'workspaces']) {
  assert.ok(manifest[field] === undefined || Object.keys(manifest[field]).length === 0,
    `${field}: this metadata index permits no external dependencies; review a license-gate change before adding one`);
}
assert.equal(manifest.private, true, 'the metadata index must not be published to npm');
assert.equal(manifest.license, 'MIT');
assert.equal(lock.lockfileVersion, 3, 'a frozen npm lock is required');
assert.equal(lock.name, manifest.name);
assert.equal(lock.version, manifest.version);
assert.deepEqual(Object.keys(lock.packages), [''], 'the lock must contain zero third-party packages');
assert.deepEqual(lock.packages[''], {
  name: manifest.name, version: manifest.version, license: manifest.license, engines: manifest.engines,
});
for (const script of ['preinstall', 'install', 'postinstall', 'prepare', 'prepublish', 'prepublishOnly']) {
  assert.equal(manifest.scripts?.[script], undefined, `unexpected install/publish hook: ${script}`);
}
console.log('License Gate: zero third-party dependencies; frozen manifest and lock agree.');
