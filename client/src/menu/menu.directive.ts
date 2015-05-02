module op.menu {
    'use strict';

    class MenuDirective implements ng.IDirective {
        restrict: string = 'E';
        scope: Object = {};
        controller: string = 'MenuController';
        controllerAs: string = 'menu';
        bindToController: boolean = true;
        templateUrl: string = 'menu.tpl.html';
        transclude: boolean = false;
        replace: boolean = true;

        static instance(): MenuDirective {
            return new MenuDirective;
        }
    }

    // register Menu Directive
    angular.module('op.menu')
        .directive('opMenu', MenuDirective.instance);
}
