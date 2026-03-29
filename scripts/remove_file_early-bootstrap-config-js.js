// This script removes the early-bootstrap-config.js file, which may contain sensitive information like the Google Maps API key. 
// This is a cleanup step to ensure that such information is not left in the source code after it has been used to inject the API key into index.html.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/assets/early-bootstrap-config.js');

try {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('[early-bootstrap-config] ✅ Removed file', filePath);
  } else {
    console.log('[early-bootstrap-config] ⚠️ Not present, nothing to remove');
  }
} catch (err) {
  console.error('[early-bootstrap-config] ❌ Remove failed:', err);
  process.exit(1);
}