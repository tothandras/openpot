module op.common {
    'use strict';

    interface IWindowServiceWithGoogleAnalytics extends ng.IWindowService {
        ga: (type: string, event: string, params: Object) => void
    }

    /* @ngInject */
    function run($rootScope: ng.IRootScopeService,
                 $window: IWindowServiceWithGoogleAnalytics,
                 $location: ng.ILocationService): void {

        $rootScope.$on('$stateChangeSuccess', (): void => {
            if ($window.ga) {
                $window.ga('send', 'pageview', {page: $location.path()});
            }
        });
    }

    angular.module('op.common')
        .run(run);
}
