module op.pots {
    'use strict';

    export interface IPotScope {

    }

    class PotController implements IPotScope {
        pot: op.common.IPot;
        showDescription: boolean = false;
        user: op.common.IUser;

        /* @ngInject */
        constructor($log: ng.ILogService,
                    public GravatarService: op.common.GravatarService,
                    public APIService: op.common.IAPIService,
                    public S3: op.common.S3) {

        }

        toggleDescription(): void {
            this.showDescription = !this.showDescription;
            if (this.showDescription && !angular.isDefined(this.user)) {
                this.APIService.getUserData(this.pot.cook).then((user: op.common.IUser) => {
                    this.user = user;
                });
            }
        }

        gravatar(email: string): string {
            return this.GravatarService.gravatar(email);
        }
    }

    angular.module('op.pots')
        .controller('PotController', PotController);
}
