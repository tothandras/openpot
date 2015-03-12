module op.common {
    'use strict';

    export interface IMenuItem {
        caption: string;
        sref: string;
        icon?: string;
    }

    export interface IMenuService {
        states: Array<ng.ui.IState>;

        getMenuItems: () => IMenuItem[];
    }

    class MenuService implements IMenuService {
        states: Array<ng.ui.IState>;

        /* @ngInject */
        constructor(
            private $log: ng.ILogService,
            private $state: ng.ui.IStateService) {

        }

        getMenuItems(): IMenuItem[] {
            var items: IMenuItem[] = [];
            var states: ng.ui.IState[] = this.$state.get();
            // TODO replace for .. of
            for (var i: number = 1; i < states.length; i++) {
                var state: ng.ui.IState = states[i];
                var data: any = state.data;
                if (data.onMenu) {
                    items.push({
                        caption: data != null ? data.caption : state.name,
                        sref: state.name,
                        icon: data != null ? data.icon : null
                    });
                }
            }
            this.$log.debug(items);
            return items;
        }
    }

    // register MenuService
    angular.module('op.common')
        .service('MenuService', MenuService);
}
