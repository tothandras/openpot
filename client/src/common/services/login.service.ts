module op.common {
    'use strict';

    export type Token = string;

    export interface ILoginService {
        login: (username: string, password: string) => ng.IPromise<Token>;
    }

    class LoginService implements ILoginService {

        /* @ngInject */
        constructor(
            private $window: ng.IWindowService,
            private $http: ng.IHttpService,
            private $q: ng.IQService) {

        }

        login(username: string, password: string): ng.IPromise<Token> {
            var deferred: ng.IDeferred<Token> = this.$q.defer()

            var auth: string = this.$window.btoa(username + ':' + password)
            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: '/token',
                headers: {
                    'Authorization': 'Basic ' + auth
                }
            }
            this.$http(requestConfig)
                .success((response: Token) => deferred.resolve(response))
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }
    }

    // register LoginService
    angular.module('op.common')
        .service('LoginService', LoginService);
}
