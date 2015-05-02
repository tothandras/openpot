module op.toolbar {
    'use strict';

    class ToolbarDirective implements ng.IDirective {
        restrict: string = 'E'; // element
        scope: any = {};
        controller: string = 'ToolbarController';
        controllerAs: string = 'toolbar';
        bindToController: boolean = true;
        templateUrl: string = 'toolbar.tpl.html';
        transclude: boolean = false;
        replace: boolean = true;

        static instance(): ToolbarDirective {
            return new ToolbarDirective;
        }
    }

    // register Toolbar Directive
    angular.module('op.toolbar')
        .directive('opToolbar', ToolbarDirective.instance);
}
