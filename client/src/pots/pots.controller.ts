module op.pots {
    'use strict';

    export interface IPotsScope {
        pots: op.common.IPot[];
        map: any;
        markers: IMarker[];
        mouseEnter: (id: string) => void;
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
        detailsID: string;

        /* @ngInject */
        constructor($log: ng.ILogService,
                    APIService: op.common.IAPIService,
                    LocationService: op.common.ILocationService,
                    uiGmapGoogleMapApi: any,
                    GravatarService: op.common.GravatarService) {

            $log.debug(this.name);
            angular.extend(this, GravatarService);

            this.map = {
                center: LocationService.getLastLocation(),
                zoom: 12,
                options: {
                    disableDefaultUI: true
                }
            };
            LocationService.getLocation().then((l: op.common.Location) => {
                this.map.center = l;
            });

            APIService.getPots().then((pots: op.common.IPot[]) => {
                pots.forEach((p: op.common.IPot) => {
                    APIService.getUserData(p.cook).then((u: op.common.IUser) => {
                        p.user = u;
                        this.pots.push(p);
                    });
                    LocationService.geocode(p.address).then((location: op.common.Location) => {
                        var m: IMarker = {
                            id: p.id,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            title: p.name
                        };
                        this.markers.push(m);
                    })
                });
            });
        }

        mouseEnter(id: string): void {
            for (var i = 0; i < this.markers.length; i++) {
                var m = this.markers[i];
                if (m.id === id) {
                    this.map.center = new op.common.Location(m.latitude, m.longitude);
                }
            }
        }

        onClick(id: string): void {
            this.detailsID = id;
        }

        showDetails(id: string): boolean {
            return this.detailsID === id;
        }
    }

    angular.module('op.pots')
        .controller('PotsController', PotsController);
}
