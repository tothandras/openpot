module op.home {
    'use strict';

    export interface IHomeScope {
        name: string;
    }

    class HomeController implements IHomeScope {
        name: string = 'Home Controller';
        searchText: string;
        //selectedItem: string;
        querySearchItems: Array<string> = [];

        /* @ngInject */
        constructor($log: ng.ILogService, $scope: ng.IScope, public uiGmapGoogleMapApi: any) {
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
                            $log.debug(prediction);
                            this.querySearchItems = prediction.map((p: any) => p.terms[0].value);
                        }
                    });
                })
            });
        }

        querySearch(searchText: string): any {

        }
    }

    angular.module('op.home')
        .controller('HomeController', HomeController);
}
