export const environment = {

    //TODO: extract from environment variables (at Docker build)

    devMode: true, //because branch is 'dev'
    environmentName: 'deployed (branch-dev)', //because branch is 'dev'
    environmentCode: 'd_b-d',

    krameriusBaseUrl: 'https://api.kramerius.mzk.cz/search',
    // elasticBaseUrl: 'http://localhost:9200/moll',
    //TODO: ES login, password
};
