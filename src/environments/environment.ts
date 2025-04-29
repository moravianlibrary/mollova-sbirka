export const environment = {

    devMode: false,
    environmentName: 'production',
    environmentCode: 'p',
    ngApTest: import.meta.env["NG_APP_TEST"] || 'not-found-for-environment.ts',

    krameriusBaseUrl: 'https://api.kramerius.mzk.cz/search',
    elasticBaseUrl: 'http://localhost:9200/moll',
    //TODO: ES login, password

    //NG_APP_KRAMERIUS_BASE_URL


};
