const fs = require('fs');
const path = require('path');

// Change this to your desired system env prefix
const SYSTEM_PREFIX = 'APP_';     // e.g. APP_MY_API_URL
const ANGULAR_PREFIX = 'NG_APP_'; // what Angular expects

// Build result .env path
const envFilePath = path.join(__dirname, '../.env');

// Collect env vars from system
const systemEnv = process.env;
const output = {};

// Transform system vars with APP_ -> NG_APP_
for (const [key, value] of Object.entries(systemEnv)) {
  if (key.startsWith(SYSTEM_PREFIX)) {
    const strippedKey = key.slice(SYSTEM_PREFIX.length); // Remove 'APP_'
    const finalKey = ANGULAR_PREFIX + strippedKey;        // Add 'NG_APP_'
    output[finalKey] = value;
  }
}

// Format as .env file content
const envFileContent = Object.entries(output)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

// Write to .env
fs.writeFileSync(envFilePath, envFileContent);

console.log(`[env-generator] ✅ .env generated at ${envFilePath} with variables:\n`);
console.log(envFileContent || '⚠️ No APP_* variables found in system env.');
