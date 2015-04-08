module op.common {
    'use strict';

    var EVENT_BAD_CREDENTIALS = 'event:bad-creditentals';
    var EVENT_LOGIN_REQUIRED = 'event:auth-loginRequired';
    var EVENT_AUTH_FORBIDDEN = 'event:auth-forbidden';

    angular.module('op.common')
        .constant('EVENT_BAD_CREDENTIALS', EVENT_BAD_CREDENTIALS)
        .constant('EVENT_LOGIN_REQUIRED', EVENT_LOGIN_REQUIRED)
        .constant('EVENT_AUTH_FORBIDDEN', EVENT_AUTH_FORBIDDEN);

    /* @ngInject */
    function authInterceptor(
        $rootScope: ng.IRootScopeService,
        $injector: ng.auto.IInjectorService,
        EVENT_BAD_CREDENTIALS: string,
        EVENT_LOGIN_REQUIRED: string,
        EVENT_AUTH_FORBIDDEN: string,
        API_URL: string) {
        return {
            request: function(config: ng.IRequestConfig) {
                var SessionService: ISessionService = $injector.get('SessionService');
                var token: IToken = SessionService.token;
                if (config.url.indexOf(API_URL) === 0 && token) {
                    config.headers.Authorization = 'Bearer ' + token.token;
                }
                return config;
            },
            response: function(response: any) {
                return response;
            },
            responseError: function(rejection: any) {
                switch (rejection.status) {
                    case 400:
                        $rootScope.$broadcast(EVENT_BAD_CREDENTIALS, rejection);
                        break;
                    case 401:
                        $rootScope.$broadcast(EVENT_LOGIN_REQUIRED, rejection);
                        break;
                    case 403:
                        $rootScope.$broadcast(EVENT_AUTH_FORBIDDEN, rejection);
                        break;
                }
                return rejection;
            }
        }
    }

    /* @ngInject */
    function config(
        $httpProvider: ng.IHttpProvider,
        localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider): void {
        localStorageServiceProvider.setPrefix('op');
        $httpProvider.interceptors.push(authInterceptor);
    }

    angular.module('op.common')
        .config(config);
}
