#!/bin/sh

echo "Generating runtime environment file..."

cat <<EOF > /usr/share/nginx/html/assets/env.json
{
  "devMode": ${APP_DEV_MODE:-false},
  "environmentName": "${APP_ENV_NAME:-docker runtime}",
  "environmentCode": "${APP_ENV_CODE:-docker}",

  "krameriusBaseUrl": "${APP_KRAMERIUS_URL}",
  "elasticBaseUrl": "${APP_ELASTIC_URL}",
  "elasticLogin": "${APP_ELASTIC_LOGIN}",
  "elasticPassword": "${APP_ELASTIC_PASSWORD}",
  "googleMapsApiKey": "${APP_GOOGLE_MAPS_API_KEY}"
}
EOF

echo "✔️  env.json generated."


# Inject Google Maps API key into index.html, warn if APP_GOOGLE_MAPS_API_KEY is empty
if [ -z "${APP_GOOGLE_MAPS_API_KEY}" ]; then
  echo "⚠️  Warning: APP_GOOGLE_MAPS_API_KEY is not set. Google Maps functionality may be limited."
  sed -i "s|__GOOGLE_MAPS_API_KEY__|__NOT_SET__|g" /usr/share/nginx/html/index.html  
else
  echo "Google Maps API key provided, injecting into index.html..."
  sed -i "s|__GOOGLE_MAPS_API_KEY__|${APP_GOOGLE_MAPS_API_KEY}|g" /usr/share/nginx/html/index.html
  echo "✔️  Google Maps API key injected into index.html"   
fi

exec nginx -g "daemon off;"
