module op.common {
    'use strict';

    export interface IAPIService {
        getUserData: (id: string) => ng.IPromise<IUser>;
        getPots: () => ng.IPromise<IPot[]>;
        getUserPots: (id: string) => ng.IPromise<IPot[]>;
        getUserReservations: (id: string) => ng.IPromise<IPot[]>;
        createPot: (pot: IPot) => ng.IPromise<string>;
        deletePot: (id: string) => ng.IPromise<string>;
        reservePot: (id: string) => ng.IPromise<string>;
        rateReservation: (id: string, stars: number) => ng.IPromise<string>;
        deleteReservation: (id: string) => ng.IPromise<string>;
    }

    class APIService implements IAPIService {

        /* @ngInject */
        constructor(public $http: ng.IHttpService,
                    public $q: ng.IQService,
                    public $log: ng.ILogService,
                    public API_URL: string,
                    public Upload: any,
                    public S3: S3) {

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
                url: this.API_URL + '/user/' + id + '/pot'
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

        getUserReservations(id: string): ng.IPromise<op.common.IPot[]> {
            var deferred: ng.IDeferred<IPot[]> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'GET',
                url: this.API_URL + '/reservation'
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
                .success((id: string) => {
                    // Upload image to S3
                    var filename = id; //+ '.' + pot.image.name.split('.').pop();

                    this.Upload.upload({
                        url: this.S3.url,
                        method: 'POST',
                        fields : {
                            key: filename, // the key to store the file on S3, could be file name or customized
                            AWSAccessKeyId: this.S3.key, // AWS access key
                            acl: this.S3.acl, // sets the access to the uploaded file in the bucket
                            policy: this.S3.policy, // base64-encoded json policy
                            signature: this.S3.signature, // base64-encoded signature based on policy string
                            'Content-Type': pot.image.type,
                            filename: filename // this is needed for Flash polyfill IE8-9
                        },
                        file: pot.image
                    }).then((response: string) => {
                        deferred.resolve(id);
                    }, (reason: string) => {
                        this.deletePot(id);
                        deferred.reject(reason);
                    });
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        deletePot(id: string): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'DELETE',
                url: this.API_URL + '/pot/' + id
            };

            this.$http(requestConfig)
                .success((response: string) => {
                    deferred.resolve(response);
                })
                .error((response: string) => deferred.reject(response));

            return deferred.promise;
        }

        upload(image: File): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();
            return deferred.promise;
        }

        reservePot(id: string): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: this.API_URL + '/pot',
                data: new op.common.Pot({id: id})
            };
            this.$http(requestConfig)
                .success((response: string) => deferred.resolve(response))
                .error((reason: string) => deferred.reject(reason));

            return deferred.promise;
        }


        rateReservation(id: string, stars: number): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: this.API_URL + '/reservation',
                data: new op.common.Pot({id: id, rating: stars})
            };
            this.$http(requestConfig)
                .success((response: string) => deferred.resolve(response))
                .error((reason: string) => deferred.reject(reason));

            return deferred.promise;
        }


        ratePot(id: string, stars: number): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'POST',
                url: this.API_URL + '/reservation',
                data: new op.common.Pot({id: id, rating: stars})
            };
            this.$http(requestConfig)
                .success((response: string) => deferred.resolve(response))
                .error((reason: string) => deferred.reject(reason));

            return deferred.promise;
        }

        deleteReservation(id: string): ng.IPromise<string> {
            var deferred: ng.IDeferred<string> = this.$q.defer();

            var requestConfig: ng.IRequestConfig = {
                method: 'DELETE',
                url: this.API_URL + '/reservation',
                data: new op.common.Pot({id: id})
            };
            this.$http(requestConfig)
                .success((response: string) => deferred.resolve(response))
                .error((reason: string) => deferred.reject(reason));

            return deferred.promise;
        }
    }

    angular.module('op.common')
        .service('APIService', APIService);
}
