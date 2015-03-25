module op.common {
    'use strict';

    /* @ngInject */
    function authInterceptor(
        $rootScope: ng.IRootScopeService,
        EVENT_BAD_CREDITENTALS: string,
        EVENT_LOGIN_REQUIRED: string,
        EVENT_AUTH_FORBIDDEN: string) {
        return {
            responseError: function(rejection: any) {
                switch (rejection.status) {
                    case 400:
                        $rootScope.$broadcast(EVENT_BAD_CREDITENTALS, rejection);
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
