function getEnv(key: string, fallback: string): string {
    return typeof import.meta.env !== 'undefined' &&
      typeof import.meta.env[key] !== 'undefined'
      ? import.meta.env[key]
      : fallback;
  }
  
  export const environment = {
    devMode: false,
    environmentName: 'production',
    environmentCode: 'p',
  
    ngApTest: getEnv('NG_APP_TEST', 'not-found-for-environment.ts'),
  
    krameriusBaseUrl: getEnv('NG_APP_KRAMERIUS_URL', 'https://api.kramerius.mzk.cz/search'),
    elasticBaseUrl: getEnv('NG_APP_ELASTIC_URL', 'http://localhost:9200/moll'),
    elasticLogin: getEnv('NG_APP_ELASTIC_LOGIN', 'FIXME:LOGIN'),
    elasticPassword: getEnv('NG_APP_ELASTIC_PASSWORD', 'FIXME:PASSWORD'),
  };
  