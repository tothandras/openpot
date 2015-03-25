module op.toolbar {
    'use strict';

    class ToolbarDirective implements ng.IDirective {
        restrict: string = 'E'; // element
        scope: any = {
            /*attr1: '=', // bidirection binding to an object
            attr2: '&', // binding to an expression
            attr3: '@'  // binds to a string value*/
        };
        controller: string = 'ToolbarController';
        controllerAs: string = 'toolbar';
        bindToController: boolean = true;
        templateUrl: string = 'toolbar.tpl.html';
        transclude: boolean = false;
        replace: boolean = true;

        static instance(): ToolbarDirective {
          return new ToolbarDirective;
        }

        // link(scope: ng.IScope,
        //   element: ng.IAugmentedJQuery,
        //   attrs: ng.IAttributes,
        //   controller: IToolbarScope): void {
        //
        // }
    }

    // register Toolbar Directive
    angular.module('op.toolbar')
        .directive('opToolbar', ToolbarDirective.instance);
}
