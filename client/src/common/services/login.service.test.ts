module op.common {
    'use strict';

    beforeEach(() => {
        module('op.common');
    });

    describe('op.common.LoginService', () => {
        var loginService: any;
        var $httpBackend: ng.IHttpBackendService;
        var authRequestHandler: ng.mock.IRequestHandler;

        var username: string = 'username';
        var password: string = 'password';
        // username:password base64 encoded
        var base64: string = 'dXNlcm5hbWU6cGFzc3dvcmQ=';
        var tokenObject: any = {
            'token': 'token string',
            'admin': false
        };

        function injected($injector: ng.auto.IInjectorService): void {
            loginService = $injector.get('LoginService');
            $httpBackend = $injector.get('$httpBackend');

            authRequestHandler = $httpBackend.when('POST', '/token', undefined, (headers: any) => {
                return headers.Authorization == 'Basic ' + base64;
            });
            authRequestHandler.respond(tokenObject);
        }

        beforeEach(inject(injected));

        afterEach(() => {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be defined', () => {
            expect(loginService).toBeDefined();
            expect(loginService.login).toEqual(jasmine.any(Function));
        });

        it('should have a working login(username, password) function', () => {
            var promise: ng.IPromise<string> = loginService.login(username, password);
            $httpBackend.flush();
            promise.then((response: any) => {
                expect(response).toEqual(tokenObject.token);
            });
        });

        it('should save the token using the SessionService', () => {
            spyOn(loginService.SessionService, 'setUserData');

            var promise: ng.IPromise<string> = loginService.login(username, password);
            $httpBackend.flush();
            promise.then((response: any) => {
                expect(loginService.SessionService.setUserData).toHaveBeenCalled();
            });
        });
    });

}
