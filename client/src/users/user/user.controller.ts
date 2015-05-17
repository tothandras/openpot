module op.users {
    'use strict';

    export interface IUserScope {
        myUser: boolean;
        data: op.common.IUser;
        pots: op.common.IPot[];
        reservations: op.common.IPot[];
        deletePot: (id: string, $event: ng.IAngularEvent) => void;
        newPot: () => void;
        deleteReservation: (id: string, $event: ng.IAngularEvent) => void;
        rateReservation: (id: string, stars: number) => void;
    }

    class UserController implements IUserScope {
        name: string = 'User Controller';
        data: op.common.IUser;
        pots: op.common.IPot[];
        reservations: op.common.IPot[];
        myUser: boolean;

        newName: string;
        newDescription: string;
        newAddress: string;
        newAmount: number;
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
                    public GravatarService: op.common.GravatarService,
                    public S3: op.common.S3) {

            var id: string = $stateParams.id;
            SessionService.getUser().then((sessionUser: op.common.IUser) => {
                this.myUser =  id === '' || sessionUser.id === id;

                if (this.myUser) {
                    SessionService.getUser().then((user: op.common.IUser) => {
                        this.getUserData(user);
                    });

                    if (!SessionService.loggedIn()) {
                        $state.transitionTo('home');
                    }
                } else {
                    APIService.getUserData(id).then((user: op.common.IUser) => {
                        this.getUserData(user);
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

        getPots() {
            this.APIService.getUserPots(this.data.id).then((pots: op.common.Pot[]) => {
                this.pots = pots;
            });
        }

        getReservations() {
            this.APIService.getUserReservations(this.data.id).then((pots: op.common.Pot[]) => {
                this.reservations = pots;
            });
        }

        goToNewpot() {
            this.$state.transitionTo('user.newpot');
        }

        goToList(): void {
            this.$state.transitionTo('user.list');
            this.getPots();
        }

        newPot(): void {
            var pot = new op.common.Pot({
                name: this.newName,
                description: this.newDescription,
                address: this.newAddress,
                amount: this.newAmount,
                image: this.newImage[0]
            });
            this.APIService.createPot(pot).then((response: string) => {
                this.$state.transitionTo('user.list');
                this.getPots();

                this.newName = '';
                this.newDescription = '';
                this.newAddress = '';
                this.newImage = null;
            }, (reject: string) => {
                this.$mdDialog.show(
                    this.$mdDialog.alert()
                        .title('Hiba')
                        .content('Hibás vagy hiányzó adatok. Próbáld újra!')
                        .ok('Rendben')
                );
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

        getUserData(user: op.common.IUser) {
            this.data = user;
            this.data.image = this.GravatarService.gravatar(this.data.email);
            this.getPots();
            this.getReservations();
        }

        deleteReservation(id: string, $event: ng.IAngularEvent): void {
        }

        rateReservation(id: string, stars: number): void {
            if (stars > 0 && stars <= 5) {
                this.APIService.ratePot(id, stars).then((response: string) => {
                    for (var i = 0; i < this.reservations.length; i++) {
                        if (this.reservations[i].id === id) {
                            this.reservations[i].rating = stars;
                        }
                    }
                })
            }
        }
    }

    angular.module('op.users')
        .controller('UserController', UserController);
}
