module op.common {
    'use strict';

    /* @ngInject */
    function authInterceptor($rootScope: ng.IRootScopeService) {
        return {
            responseError: function(rejection: any) {
                switch (rejection.status) {
                    case 401:
                        $rootScope.$broadcast('event:auth-loginRequired', rejection);
                        break;
                    case 403:
                        $rootScope.$broadcast('event:auth-forbidden', rejection);
                        break;
                }
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
