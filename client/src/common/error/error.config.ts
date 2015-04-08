module op.common {
    'use strict';

    /* @ngInject */
    function config($provide: ng.auto.IProvideService): void {
        $provide.decorator('$exceptionHandler', ($delegate: ng.IExceptionHandlerService, $injector: ng.auto.IInjectorService) => {
            return function(exception: EventException, cause: string) {
                $delegate(exception, cause);
                var $mdToast: any = $injector.get('$mdToast');
                $mdToast.show(
                    $mdToast.simple()
                        .content(exception.message)
                        .position('bottom right')
                        .hideDelay(3000)
                );
            }
        });
    }

    angular.module('op.common')
        .config(config);
}
