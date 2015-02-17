module op.common {
    'use strict';

    export interface ITokenObject {
        token: string;
        admin?: boolean;
    }

    export interface ILoginService {
        login: (username: string, password: string) => ng.IPromise<string>;
    }

    class LoginService implements ILoginService {

        /* @ngInject */
        constructor(
            private $window: ng.IWindowService,
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private SessionService: op.common.ISessionService) {

        }

        login(username: string, password: string): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer()

            var auth: string = this.$window.btoa(username + ':' + password)
            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: '/token',
                headers: {
                    'Authorization': 'Basic ' + auth
                }
            }
            this.$http(requestConfig)
                .success((response: ITokenObject) => {
                    var token: string = response.token;
                    var admin: boolean = response.admin ? response.admin : false;
                    deferred.resolve(token);
                    this.SessionService.setUserData(username, token, admin);
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }
    }

    // register LoginService
    angular.module('op.common')
        .service('LoginService', LoginService);
}
