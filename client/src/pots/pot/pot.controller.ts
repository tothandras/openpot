module op.pots {
    'use strict';

    export interface IPotScope {
        //toggleDescription: () => void;
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
            this.APIService.getUserData(this.pot.cook).then((user: op.common.IUser) => {
                user.image = this.GravatarService.gravatar(user.email);
                this.user = user;
            });
        }

        //toggleDescription(): void {
        //    this.showDescription = !this.showDescription;
        //    if (this.showDescription && !angular.isDefined(this.user)) {
        //        this.APIService.getUserData(this.pot.cook).then((user: op.common.IUser) => {
        //            user.image = this.GravatarService.gravatar(user.email);
        //            this.user = user;
        //        });
        //    }
        //}
    }

    angular.module('op.pots')
        .controller('PotController', PotController);
}
