export const environment = {

    devMode: true, //hardcoded for local development with ng-serve; change if you want to hide it in UI
    environmentName: 'development (ng-serve)',

    //TODO: extract from environment variables (build/runtime)
    krameriusBaseUrl: 'https://api.kramerius.mzk.cz/search',
    elasticBaseUrl: 'http://localhost:9200/moll',
    //TODO: ES login, password

};
