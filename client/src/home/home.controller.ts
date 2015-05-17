module op.home {
    'use strict';

    export interface IHomeScope {
        name: string;
        search: () => void;
    }

    class HomeController implements IHomeScope {
        name: string = 'Home Controller';
        searchText: string;
        selectedItem: string;
        querySearchItems: Array<string> = [];

        /* @ngInject */
        constructor($log: ng.ILogService,
                    $scope: ng.IScope,
                    public $state: ng.ui.IStateService,
                    public uiGmapGoogleMapApi: any) {
            this.uiGmapGoogleMapApi.then((maps: any) => {
                var autocompleteService = new maps.places.AutocompleteService();
                $scope.$watch('home.searchText', () => {
                    if (!angular.isDefined(this.searchText) || this.searchText === '') {
                        return;
                    }
                    autocompleteService.getPlacePredictions({
                        input: this.searchText,
                        language: 'hu-HU',
                        types: ['(cities)'],
                        componentRestrictions: {country: 'hu'}
                    }, (prediction: any, status: any) => {
                        if (status === 'OK') {
                            this.querySearchItems = prediction.map((p: any) => p.terms[0].value);
                        }
                    });
                })
            });
        }

        search(): void {
            this.$state.transitionTo('pots', {search: this.searchText});
        }
    }

    angular.module('op.home')
        .controller('HomeController', HomeController);
}
