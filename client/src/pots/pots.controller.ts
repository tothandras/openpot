module op.pots {
    'use strict';

    export interface IPotsScope {
        pots: op.common.IPot[];
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

        /* @ngInject */
        constructor(
            $log: ng.ILogService,
            APIService: op.common.IAPIService) {
            $log.debug(this.name);
            APIService.getPots().then((pots: op.common.IPot[]) => {
                this.pots = pots;
            });
        }
    }

    angular.module('op.pots')
        .controller('PotsController', PotsController);
}
