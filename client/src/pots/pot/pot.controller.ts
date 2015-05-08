module op.pots {
    'use strict';

    export interface IPotScope {

    }

    class PotController implements IPotScope {
        pot: op.common.IPot;
        showDescription: boolean = false;

        /* @ngInject */
        constructor($log: ng.ILogService, GravatarService: op.common.GravatarService) {
            angular.extend(this, this.pot);
            angular.extend(this, GravatarService);
        }

        toggleDescription(): void {
            this.showDescription = !this.showDescription;
        }
    }

    angular.module('op.pots')
        .controller('PotController', PotController);
}
