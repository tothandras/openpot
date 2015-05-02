module op.common {
    'use strict';

    export interface IAPIService {
        getUserData: (id: string) => ng.IPromise<IUser>;
        getPots: () => ng.IPromise<IPot[]>;
        getUserPots: (id: string) => ng.IPromise<IPot[]>;
        createPot: (pot: IPot) => ng.IPromise<string>;
    }

    class APIService implements IAPIService {

        /* @ngInject */
        constructor(
            public $http: ng.IHttpService,
            public $q: ng.IQService,
            public API_URL: string) {
        }

        getUserData(id: string): ng.IPromise<IUser> {
            var deferred: ng.IDeferred<IUser> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'GET',
                url: this.API_URL + '/user/' + id
            };
            this.$http(requestConfig)
                .success((response: any) => {
                             var userData: IUser = new User(response);
                             deferred.resolve(userData);
                         })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        getPots(): ng.IPromise<IPot[]> {
            var deferred: ng.IDeferred<IPot[]> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'GET',
                url: this.API_URL + '/pot'
            };
            this.$http(requestConfig)
                .success((response: any) => {
                    var pots: IPot[] = [];
                    if (angular.isArray(response)) {
                        response.forEach((p: any) => {
                           var pot = new Pot(p);
                            // TODO
                            //this.getUserData(pot.cook).then((user) => {
                            //});
                            pots.push(pot);
                        });
                        deferred.resolve(pots);
                    }
                    deferred.reject('Response is not an array');
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        getUserPots(id: string): ng.IPromise<IPot[]> {
            var deferred: ng.IDeferred<IPot[]> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'GET',
                url: this.API_URL + '/user/'  + id + '/pot'
            };
            this.$http(requestConfig)
                .success((response: any) => {
                    var pots: IPot[] = [];
                    if (angular.isArray(response)) {
                        response.forEach((p: any) => {
                            var pot = new Pot(p);
                            pots.push(pot);
                        });
                        deferred.resolve(pots);
                    }
                    deferred.reject('Response is not an array');
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        createPot(pot: IPot): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: this.API_URL + '/pot',
                data: pot
            };
            this.$http(requestConfig)
                .success((response: string) => {
                    deferred.resolve(response);
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }
    }

    angular.module('op.common')
        .service('APIService', APIService);
}
