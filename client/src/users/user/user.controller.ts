module op.users {
    'use strict';

    export interface IUserScope {
        data: op.common.IUser;
        deletePot: (id: string) => void;
    }

    class UserController implements IUserScope {
        name: string = 'User Controller';
        data: op.common.IUser;
        pots: op.common.IPot[];

        newName: string;
        newDescription: string;
        newAddress: string;
        error: string;

        /* @ngInject */
        constructor($scope: ng.IScope,
                    public $log: ng.ILogService,
                    public $state: ng.ui.IStateService,
                    $stateParams: any,
                    md5: any,
                    SessionService: op.common.ISessionService,
                    public APIService: op.common.IAPIService,
                    LoginDialogService: op.login.ILoginDialogService) {
            $log.debug(this.name);

            SessionService.getUser().then((user: op.common.IUser) => {
                this.data = user;
                this.data.image = 'http://www.gravatar.com/avatar/' + md5.createHash(this.data.email || '') + '?d=mm&s=200';
                this.getPots(this.data.id);
            });

            if (!SessionService.loggedIn()) {
                LoginDialogService.showDialog(null).then((p: ng.IPromise<string>) => {
                    $log.debug(p);
                    $state.transitionTo('home');
                });
            }

            $scope.$watch('user.data.id', (id: string) => {
                this.getPots(id);
            });

            //if ($stateParams.id) {
            //    this.id = $stateParams.id;
            //    APIService.getUserData(this.id).then((data: op.common.IUser) => {
            //        this.data = data;
            //    });
            //} else if (this.myUser) {
            //    this.id = this.myUser.id;
            //    APIService.getUserData(this.id).then((data: op.common.IUser) => {
            //        this.data = data;
            //    });
            //}
        }

        getPots(id: string) {
            this.APIService.getUserPots(id).then((pots: op.common.Pot[]) => {
                this.pots = pots;
            });
        }

        goToNewpot() {
            this.$state.transitionTo('user.newpot');
        }

        goToList(): void {
            this.$state.transitionTo('user.list');
            this.getPots(this.data.id);
        }

        newPot(): void {
            var pot = new op.common.Pot({
                name: this.newName,
                description: this.newDescription,
                address: this.newAddress
            });
            this.APIService.createPot(pot).then((response: string) => {
                this.$state.transitionTo('user.list');
                this.getPots(this.data.id);
            });
        }


        deletePot(id: string): void {
            this.APIService.deletePot(id).then(() => {
                for(var i = 0; i < this.pots.length; i++) {
                    if (this.pots[i].id === id) {
                        this.pots.splice(i, 1);
                    }
                }
            }, (reason: string) => {
                this.$log.debug(reason)
            })
        }
    }

    angular.module('op.users')
        .controller('UserController', UserController);
}
