import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Preview containers use development mode for the API. Vite's production mode
// alone does not override an inherited NODE_ENV, so set it for this build only.
const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const result = spawnSync(process.execPath, [viteCli, 'build', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
});

if (result.error) {
  console.error(result.error.message);
}
process.exit(result.status ?? 1);
