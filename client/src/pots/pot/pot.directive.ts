module op.pots {
    'use strict';

    class PotDirective implements ng.IDirective {
        restrict: string = 'E'; // element
        scope: any = {
            pot: '=', // bidirection binding to an object
        };
        controller: string = 'PotController';
        controllerAs: string = 'pot';
        bindToController: boolean = true;
        templateUrl: string = 'pot.tpl.html';
        transclude: boolean = false;

        static instance(): PotDirective {
            return new PotDirective();
        }
    }

    angular.module('op.pots')
        .directive('opPot', PotDirective.instance);
}
