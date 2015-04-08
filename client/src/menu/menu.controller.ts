module op.menu {
    'use strict';

    export interface IMenuScope {
        name: string;
        items: IMenuItem[];
        open: boolean;

        close: () => void;
    }

    class MenuController implements IMenuScope {
        name: string;
        items: IMenuItem[];
        open: boolean;

        /* @ngInject */
        constructor(private $mdSidenav: any,
                    $rootScope: ng.IRootScopeService,
                    MenuService: IMenuService) {
            this.name = 'Menu Controller';
            this.items = MenuService.getMenuItems();

            $rootScope.$on('$stateChangeStart', () => {
                this.close();
            });
        }

        close() {
            this.$mdSidenav('left').close();
        }
    }

    // register MenuController
    angular.module('op.menu')
        .controller('MenuController', MenuController);
}
