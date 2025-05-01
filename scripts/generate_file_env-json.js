// scripts/generate-env-json.js
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '../src/assets/env.json');

const config = {
  devMode: process.env.APP_DEV_MODE === 'true', 
  environmentName: process.env.APP_ENV_NAME || 'not defined',
  environmentCode: process.env.APP_ENV_CODE || 'n-d',

  krameriusBaseUrl: process.env.APP_KRAMERIUS_URL || '',
  elasticBaseUrl: process.env.APP_ELASTIC_URL || '',
  elasticLogin: process.env.APP_ELASTIC_LOGIN || '',
  elasticPassword: process.env.APP_ELASTIC_PASSWORD || ''
};

fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
console.log(`✔️  env.json generated at ${outputPath}`);
