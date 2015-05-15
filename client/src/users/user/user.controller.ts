module op.users {
    'use strict';

    export interface IUserScope {
        myUser: boolean;
        data: op.common.IUser;
        pots: op.common.IPot[];
        deletePot: (id: string, $event: ng.IAngularEvent) => void;
        newPot: () => void;
    }

    class UserController implements IUserScope {
        name: string = 'User Controller';
        data: op.common.IUser;
        pots: op.common.IPot[];
        myUser: boolean;

        newName: string;
        newDescription: string;
        newAddress: string;
        newImage: File[];
        error: string;


        querySearchItems: Array<string> = [];

        /* @ngInject */
        constructor(public $log: ng.ILogService,
                    public $state: ng.ui.IStateService,
                    $scope: ng.IScope,
                    $stateParams: any,
                    public $mdDialog: any,
                    SessionService: op.common.ISessionService,
                    public APIService: op.common.IAPIService,
                    LoginDialogService: op.login.ILoginDialogService,
                    GravatarService: op.common.GravatarService,
                    public S3: op.common.S3) {

            var id: string = $stateParams.id;
            SessionService.getUser().then((sessionUser: op.common.IUser) => {
                this.myUser =  id === '' || sessionUser.id === id;

                if (this.myUser) {
                    SessionService.getUser().then((user: op.common.IUser) => {
                        this.data = user;
                        this.data.image = GravatarService.gravatar(this.data.email);
                        this.getPots(this.data.id);
                    });

                    if (!SessionService.loggedIn()) {
                        LoginDialogService.showDialog(null).then((p: ng.IPromise<string>) => {
                            $state.transitionTo('home');
                        });
                    }
                } else {
                    APIService.getUserData(id).then((user: op.common.IUser) => {
                        this.data = user;
                        this.data.image = GravatarService.gravatar(this.data.email);
                        this.getPots(this.data.id);
                    }, (reason: string) => this.$state.transitionTo('home'));
                }
            });

            //uiGmapGoogleMapApi.then((maps: any) => {
            //    var autocompleteService = new maps.places.AutocompleteService(null, {
            //        language: 'hu',
            //        types: ['address'],
            //        componentRestrictions: {country: 'hu'}
            //    });
            //    $scope.$watch('user.newAddress', () => {
            //        if (!angular.isDefined(this.newAddress) || this.newAddress === '') {
            //            return;
            //        }
            //        autocompleteService.getPlacePredictions({
            //            input: this.newAddress,
            //        }, (prediction: any, status: any) => {
            //            if (status === 'OK') {
            //                $log.debug(prediction);
            //                this.querySearchItems = prediction.map((p: any) => p.description);
            //            }
            //        });
            //    })
            //});
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
                address: this.newAddress,
                image: this.newImage[0]
            });
            this.APIService.createPot(pot).then((response: string) => {
                this.$state.transitionTo('user.list');
                this.getPots(this.data.id);

                this.newName = '';
                this.newDescription = '';
                this.newAddress = '';
                this.newImage = null;
            });
        }


        deletePot(id: string, $event: ng.IAngularEvent): void {
            this.$mdDialog.show(
                this.$mdDialog.confirm()
                    .title('Törlés')
                    .content('Biztosan törölni szeretné?')
                    .ok('Igen')
                    .cancel('Mégse')
                    .targetEvent($event)
            )
                .then(() => {
                    this.APIService.deletePot(id).then(() => {
                        for (var i = 0; i < this.pots.length; i++) {
                            if (this.pots[i].id === id) {
                                this.pots.splice(i, 1);
                            }
                        }
                    }, (reason: string) => {
                        this.$log.debug(reason)
                    })
                });
        }

        fileDropped($files: Array<File>, $event: ng.IAngularEvent, $rejectedFiles: Array<File>): void {
            this.$log.debug($files);
            this.$log.debug($rejectedFiles);
        }
    }

    angular.module('op.users')
        .controller('UserController', UserController);
}
