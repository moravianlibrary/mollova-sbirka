function getEnv(key: string, fallback: string): string {
  return typeof import.meta.env !== 'undefined' &&
    typeof import.meta.env[key] !== 'undefined'
    ? import.meta.env[key]
    : fallback;
}

export const environment = {

  // used by EnvironmentService
  useRuntimeConfig: true, // DŮLEŽITÉ: pokud je true, konfigurace se načítá z env.json; Pro produkci vždy true

  // overriden with env.json if useRuntimeConfig is true
  devMode: false, // pro produkci ziskej z promenne APP_DEV_MODE (přes env.json)
  environmentName: 'production', // pro produkci ziskej z promenne APP_ENV_NAME (přes env.json)
  environmentCode: 'p', // pro produkci ziskej z promenne APP_ENV_CODE (přes env.json)

  krameriusBaseUrl: '', // pro produkci ziskej z promenne APP_KRAMERIUS_URL (přes env.json)
  elasticBaseUrl: '', // pro produkci ziskej z promenne APP_ELASTIC_URL (přes env.json)
  elasticLogin: '', // pro produkci ziskej z promenne APP_ELASTIC_LOGIN (přes env.json)
  elasticPassword: '', // pro produkci ziskej z promenne APP_ELASTIC_PASSWORD (přes env.json)
};
