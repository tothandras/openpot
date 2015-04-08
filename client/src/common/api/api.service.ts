module op.common {
    'use strict';

    export interface IAPIService {
        getUserData: (id: string) => ng.IPromise<IUser>;
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
                url: this.API_URL // + '/users/' + id
            };
            this.$http(requestConfig)
                .success((response: any) => {
                             var userData: IUser = new User(response);
                             deferred.resolve(userData);
                         })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }
    }

    angular.module('op.common')
        .service('APIService', APIService);
}
