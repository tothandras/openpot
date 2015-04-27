module op.common {
    'use strict';

    export interface ILocationService {
        getLocation: () => ng.IPromise<Location>;
        getLastLocation: () => Location;
    }

    class LocationService implements ILocationService {
        geolocation: Geolocation;
        location: Location = new Location();
        deferred: ng.IDeferred<Location>;
        key: string = 'lastLocation';

        /* @ngInject */
        constructor(
            private $log: ng.ILogService,
            private $q: ng.IQService,
            public localStorageService: ng.local.storage.ILocalStorageService<Location>,
            $window: ng.IWindowService) {
            this.deferred = $q.defer();
            if ('geolocation' in $window.navigator) {
                this.geolocation = $window.navigator.geolocation;
                this.geolocation.getCurrentPosition((p: Position) => this.success(p), () => this.error());
            } else {
                this.error();
            }
        }

        success(p: Position): void {
            this.location.latitude = p.coords.latitude;
            this.location.longitude = p.coords.longitude;
            this.localStorageService.set(this.key, this.location);
            this.deferred.resolve(this.location);
        }

        error(): void {
            var e: string = 'Unable to retrieve the user\'s location';
            this.$log.error(e);
            this.deferred.reject(e)
        }

        getLocation(): ng.IPromise<Location> {
            return this.deferred.promise;
        }

        getLastLocation(): Location {
            return this.localStorageService.get(this.key);
        }
    }

    angular.module('op.common')
        .service('LocationService', LocationService);
}
