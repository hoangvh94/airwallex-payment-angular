// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// `.env.ts` is generated by the `npm run env` command
// `npm run env` exposes environment variables as JSON for any usage you might
// want, like displaying the version or getting extra config from your CI bot, etc.
// This is useful for granularity you might need beyond just the environment.
// Note that as usual, any environment variables you expose through it will end up in your
// bundle, and you should not use it for any sensitive information like passwords or keys.

export const environment = {
    quadrantUrl: 'http://192.168.13.128:8066/',
    quadrantApiUrl: 'api/v1/',
    baseUrl: 'http://localhost:8081/',
    // apiUrl: 'api/v1/',
    apiUrl: 'http://localhost:8081/api/v1',
    authenUrl: 'http://localhost:8081/api/auth',
  
    // authenUrl: 'http://192.168.1.27:8081/api/auth',
    // clientSecret: 'repairsAdvisorisgoingtothemoonanddropgoldtofoundersBAHthenIcanplaygameallday',
    production: false,
    // version: env['npm_package_version'] + '-dev',
    serverUrl: '/api',
    defaultLanguage: 'en-US',
    supportedLanguages: ['en-US'],
    airwallex: {
        // Demo web app URL: https://demo.airwallex.com/app/login

        apiUrl: 'https://api-demo.airwallex.com/api',
        clientEmail: 'demo+repairsadvisorllc@airwallex.com',
        clientPassword: 'Abcde1234',
        accountId: '335cfeb5-b6d3-4243-b0fa-1f67b5266bbf',
        clientId: 'E9G_znnUQtuPD16QZlURMw',
        apiKey: 'bfcf765d976521a22337c57d44dd9a65580f7b0acae4617338aa4f2e6178b7a34e73aee762e40d656dc962c64841a44a',
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
