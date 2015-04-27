module op.pots {
    'use strict';

    export interface IPotsScope {
        pots: op.common.IPot[];
        map: any;
        markers: IMarker[];
        hover: (id: string) => void;
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
        map: any;
        markers: IMarker[] = [];

        /* @ngInject */
        constructor(
            $log: ng.ILogService,
            APIService: op.common.IAPIService,
            LocationService: op.common.ILocationService,
            uiGmapGoogleMapApi: any) {

            $log.debug(this.name);

            this.map = {
                center: LocationService.getLastLocation(),
                zoom: 8,
                options: {
                    disableDefaultUI: true
                }
            };
            LocationService.getLocation().then((l: op.common.Location) => {
                this.map.center = l;
            });

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

        hover(id: string): void {
            for (var i = 0; i < this.markers.length; i++) {
                var m = this.markers[i];
                if (m.id === id) {
                    this.map.center = new op.common.Location(m.latitude, m.longitude);
                }
            }
        }
    }

    angular.module('op.pots')
        .controller('PotsController', PotsController);
}
