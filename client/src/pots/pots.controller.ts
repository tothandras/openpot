module op.pots {
    'use strict';

    export interface IPotsScope {
        pots: op.common.IPot[];
    }

    export interface IMarker {
        id: string;
        latitude: number;
        longitude: number;
        title: string;
    }

    class PotsController implements IPotsScope {
        name: string = 'Pots Controller';
        pots: op.common.IPot[] = [];
        map: any = {
            center: {latitude: 45, longitude: -73},
            zoom: 8,
            options: {
                disableDefaultUI: true
            }
        };
        markers: IMarker[] = [];

        /* @ngInject */
        constructor(
            $log: ng.ILogService,
            APIService: op.common.IAPIService,
            uiGmapGoogleMapApi: any) {
            $log.debug(this.name);
            APIService.getPots().then((pots: op.common.IPot[]) => {
                this.pots = pots;
                uiGmapGoogleMapApi.then((maps: any) => {
                    this.pots.forEach((p: op.common.Pot) => {
                        var geocoder = new maps.Geocoder();
                        geocoder.geocode({address: p.address}, (results: any, status: any) => {
                            if (status === maps.GeocoderStatus.OK) {
                                var location: op.common.Location = new op.common.Location(
                                    results[0].geometry.location.lat(),
                                    results[0].geometry.location.lng()
                                );
                                $log.debug(location);
                                $log.debug(p.id);
                                var m: IMarker = {
                                    id: p.id,
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                    title: p.name
                                };
                                this.markers.push(m);
                            }
                        });
                    });
                });
            });
        }
    }

    angular.module('op.pots')
        .controller('PotsController', PotsController);
}
