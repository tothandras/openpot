module op.common {
    'use strict';

    /*interface MenuScope extends Object {

    }*/

    class MenuDirective implements ng.IDirective {
        restrict: string = 'EA'; // element
        scope: Object = {
            /*attr1: '=', // bidirection binding to an object
            attr2: '&', // binding to an expression
            attr3: '@'  // binds to a string value*/
        };
        controller: string = 'MenuController';
        controllerAs: string = 'menu';
        bindToController: boolean = true;
        templateUrl: string = 'menu.tpl.html';
        transclude: boolean = false;

        static instance(): MenuDirective {
          return new MenuDirective;
        }

        // link(scope: ng.IScope,
        //   element: ng.IAugmentedJQuery,
        //   attrs: ng.IAttributes,
        //   controller: IMenuScope): void {
        //
        // }
    }

    // register Menu Directive
    angular.module('op.common')
        .directive('menu', MenuDirective.instance);
}
