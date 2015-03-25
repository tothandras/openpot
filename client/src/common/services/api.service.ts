module op.common {
    'use strict';

    export interface IUserData {
        username: string;
        name: string;
        image: string;
    }

    export interface IAPIService {
        getUserData: () => ng.IPromise<IUserData>;
    }

    class APIService implements IAPIService {

        /* @ngInject */
        constructor(
            public $http: ng.IHttpService,
            public $q: ng.IQService,
            public API_URL: string) {
        }

        getUserData(): ng.IPromise<IUserData> {
            var deferred: ng.IDeferred<IUserData> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'GET',
                url: this.API_URL
            };
            this.$http(requestConfig)
                .success((response: any) => {
                    var userData: IUserData = {
                        username: response.username,
                        name: response.name,
                        image: response.image
                    };
                    deferred.resolve(userData);
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }
    }

    // register APIService
    angular.module('op.common')
        .service('APIService', APIService);
}
