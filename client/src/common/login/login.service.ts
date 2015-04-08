module op.common {
    'use strict';

    export interface ILoginService {
        login: (username: string, password: string) => ng.IPromise<string>;
        logout: () => ng.IPromise<string>;
    }

    class LoginService implements ILoginService {

        /* @ngInject */
        constructor(public AUTH_URL: string,
                    public $window: ng.IWindowService,
                    public $http: ng.IHttpService,
                    public $q: ng.IQService,
                    public SessionService: op.common.ISessionService,
                    public Token: IToken) {

        }

        login(email: string, password: string): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var auth: string = this.$window.btoa(email + ':' + password);
            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: this.AUTH_URL,
                headers: {
                    'Authorization': 'Basic ' + auth
                }
            };
            this.$http(requestConfig)
                .success((response: IToken) => {
                             var token: string = response.token;
                             deferred.resolve(token);
                             this.SessionService.setUser(response);
                         })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        // TODO
        logout(): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();
            deferred.resolve('TODO');
            this.SessionService.unsetUser();
            return deferred.promise;
        }
    }

    // register LoginService
    angular.module('op.common')
        .service('LoginService', LoginService);
}
