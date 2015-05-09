module op.pots {
    'use strict';

    export interface IPotScope {

    }

    class PotController implements IPotScope {
        pot: op.common.IPot;
        showDescription: boolean = false;

        /* @ngInject */
        constructor($log: ng.ILogService, public GravatarService: op.common.GravatarService) {
            angular.extend(this, this.pot);
        }

        toggleDescription(): void {
            this.showDescription = !this.showDescription;
        }

        gravatar(email: string): string {
            return this.GravatarService.gravatar(email);
        }
    }

    angular.module('op.pots')
        .controller('PotController', PotController);
}
