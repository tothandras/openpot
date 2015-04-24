module op.common {
    'use strict';

    export interface IAuthService {
        register: (user: IUser) => ng.IPromise<string>;
        login: (email: string, password: string) => ng.IPromise<string>;
        logout: () => void;
    }

    class AuthService implements IAuthService {

        /* @ngInject */
        constructor(public AUTH_URL: string,
                    public $window: ng.IWindowService,
                    public $http: ng.IHttpService,
                    public $q: ng.IQService,
                    public SessionService: op.common.ISessionService) {

        }

        register(user: IUser): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();
            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: this.AUTH_URL + '/register',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: user
            };
            this.$http(requestConfig)
                .success((response: string) => {
                    deferred.resolve(response);
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        login(email: string, password: string): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var auth: string = this.$window.btoa(email + ':' + password);
            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: this.AUTH_URL + '/login',
                headers: {
                    'Authorization': 'Basic ' + auth
                }
            };
            this.$http(requestConfig)
                .success((response: IToken) => {
                    var token: string = response.token;
                    this.SessionService.setUser(response);
                    deferred.resolve(token);
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        logout(): void {
            this.SessionService.unsetUser();
        }
    }

    // register LoginService
    angular.module('op.common')
        .service('AuthService', AuthService);
}
