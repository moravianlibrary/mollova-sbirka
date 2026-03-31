// This script is used in the build process to prepare the early-bootstrap-config.js file by copying the content from a stub file. 
// The stub file (early-bootstrap-config.stub.js) should contain a default configuration (e.g., an empty config object) 
// which prevents runtime error in dev console if the file is missing.
// In these cases (npm build) the actual configuration values will be injected into index.html from environment variables, 
// so the content of early-bootstrap-config.js will be overridden at runtime and the stub content will not be used in production.

const fs = require('fs');
const path = require('path');

const stubPath = path.join(__dirname, '../src/assets/early-bootstrap-config.stub.js');
const outputPath = path.join(__dirname, '../src/assets/early-bootstrap-config.js');

try {
  const content = fs.readFileSync(stubPath, 'utf-8');
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log('[early-bootstrap-config] ✅ Prepared build stub');
} catch (err) {
  console.error('[early-bootstrap-config] ❌ Failed to prepare build stub:', err);
  process.exit(1);
}