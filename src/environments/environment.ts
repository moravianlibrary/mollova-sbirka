export const environment = {

    devMode: false,
    environmentName: 'production',
    environmentCode: 'p',
    ngApTest: import.meta.env["NG_APP_TEST"] || 'not-found-for-environment.ts',

    krameriusBaseUrl: import.meta.env["NG_APP_KRAMERIUS_URL"] || 'https://api.kramerius.mzk.cz/search',
    elasticBaseUrl: import.meta.env["NG_APP_ELASTIC_URL"] || 'http://localhost:9200/moll',
    elasticLogin: import.meta.env["NG_APP_ELASTIC_LOGIN"] || 'FIXME:LOGIN',
    elasticPassword: import.meta.env["NG_APP_ELASTIC_PASSWORD"] || 'FIXME:PASSWORD',

};
