module op.common {
    'use strict';

    export interface ILocationService {
        getLocation: () => ng.IPromise<Location>;
        getLastLocation: () => Location;
        geocode: (address: string) => ng.IPromise<Location>;
    }

    class LocationService implements ILocationService {
        geolocation: Geolocation;
        location: Location = new Location();
        deferred: ng.IDeferred<Location>;
        key: string = 'lastLocation';

        /* @ngInject */
        constructor(public $log: ng.ILogService,
                    public $q: ng.IQService,
                    public localStorageService: ng.local.storage.ILocalStorageService<Location>,
                    public uiGmapGoogleMapApi: any,
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

        geocode(address: string): ng.IPromise<Location> {
            var deferred: ng.IDeferred<Location> = this.$q.defer();

            this.uiGmapGoogleMapApi.then((maps: any) => {
                var geocoder = new maps.Geocoder();
                geocoder.geocode({address: address}, (results: any, status: any) => {
                    if (status === maps.GeocoderStatus.OK) {
                        var location: op.common.Location = new op.common.Location(
                            results[0].geometry.location.lat(),
                            results[0].geometry.location.lng()
                        );
                        deferred.resolve(location);
                    } else {
                        deferred.reject();
                    }
                });
            });

            return deferred.promise;
        }
    }

    angular.module('op.common')
        .service('LocationService', LocationService);
}
