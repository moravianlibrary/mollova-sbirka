
// This script reads the local environment file (environment.local.ts) and generates a JavaScript file (early-bootstrap-config.js) 
// that can be loaded early in the app's lifecycle to provide configuration values (like the Google Maps API key) before Angular initializes. 
// This allows us to avoid hardcoding sensitive values in the source code and instead inject them at runtime.

require('esbuild-register'); // umožní require .ts souborů

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../src/environments/environment.local.ts');
const outputPath = path.join(__dirname, '../src/assets/early-bootstrap-config.js');

function generate() {
    try {
        const envModule = require(envPath);

        const env = envModule.environment || envModule.default || {};

        const config = {
            googleMapsApiKey: env.googleMapsApiKey || ''
        };

        const content = `window.__APP_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;

        fs.writeFileSync(outputPath, content, 'utf-8');

        console.log('[early-bootstrap-config] ✅ Generated, saving to file ', outputPath);
    } catch (err) {
        console.error('[early-bootstrap-config] ❌ Failed:', err);

        const fallback = `window.__APP_CONFIG__ = {};\n`;
        fs.writeFileSync(outputPath, fallback, 'utf-8');
    }
}

generate();