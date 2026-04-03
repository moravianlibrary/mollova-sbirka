# This script injects the Google Maps API key into the built index.html file in the dist folder.
# It should be run after npm run build when running the application locally without Docker. 
# It is not needed when running with Docker, as the Docker entrypoint script will handle the injection at runtime.
# Usage: sh scripts/inject_google_maps_key_into_dist.sh; npx serve dist/moll-frontend/browser -l 8080 

#!/bin/sh
set -e

INDEX_FILE="dist/moll-frontend/browser/index.html"

if [ ! -f "$INDEX_FILE" ]; then
  echo "ERROR: $INDEX_FILE not found. Run npm run build first."
  exit 1
fi

if [ -z "${APP_GOOGLE_MAPS_API_KEY}" ]; then
  echo "WARNING: APP_GOOGLE_MAPS_API_KEY is not set. Marking Google Maps key as not set."
  sed -i.bak 's|__GOOGLE_MAPS_API_KEY__|__NOT_SET__|g' "$INDEX_FILE"
else
  echo "Injecting Google Maps API key into dist index.html..."
  sed -i.bak "s|__GOOGLE_MAPS_API_KEY__|${APP_GOOGLE_MAPS_API_KEY}|g" "$INDEX_FILE"
  echo "Done."
fi

rm -f "${INDEX_FILE}.bak"