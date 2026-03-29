export const environment = {

  // used by EnvironmentService
  useStaticRuntimeConfig: true, // DŮLEŽITÉ: pokud je true, konfigurace se načítá z env.json; Pro produkci vždy true, pro lokální vývoj (environment.local.ts) false

  // overriden with env.json if useStaticRuntimeConfig is true
  devMode: true, // pro produkci ziskej z promenne APP_DEV_MODE (přes env.json)
  environmentName: 'deployed (branch dev)', // pro produkci ziskej z promenne APP_ENV_NAME (přes env.json)
  environmentCode: 'd_d', // pro produkci ziskej z promenne APP_ENV_CODE (přes env.json)

  krameriusBaseUrl: '', // pro produkci ziskej z promenne APP_KRAMERIUS_URL (přes env.json)
  elasticBaseUrl: '', // pro produkci ziskej z promenne APP_ELASTIC_URL (přes env.json)
  elasticLogin: '', // pro produkci ziskej z promenne APP_ELASTIC_LOGIN (přes env.json)
  elasticPassword: '', // pro produkci ziskej z promenne APP_ELASTIC_PASSWORD (přes env.json)
  googleMapsApiKey: '', // pro produkci ziskej z promenne APP_GOOGLE_MAPS_API_KEY (přes early-bootstrap-config.js)

};
