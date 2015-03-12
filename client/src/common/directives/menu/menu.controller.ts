module op.common {
    'use strict';

    export interface IMenuScope {
        name: string;
        items: IMenuItem[];
        open: boolean;

        toggle: () => void;
        close: () => void;
    }

    class MenuController implements IMenuScope {
        name: string;
        items: IMenuItem[];
        open: boolean;

        /* @ngInject */
        constructor(
            $rootScope: ng.IRootScopeService,
            MenuService: IMenuService) {
            this.name = 'Menu Controller';
            this.items = MenuService.getMenuItems();

            $rootScope.$on('$stateChangeStart', () => {
                this.close();
            });
        }

        toggle() {
            this.open = !this.open;
        }

        close() {
            this.open = false;
        }
    }

    // register MenuController
    angular.module('op.common')
        .controller('MenuController', MenuController);
}
