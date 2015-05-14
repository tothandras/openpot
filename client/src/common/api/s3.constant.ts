module op.common {
    export class S3 {
        key: string;
        acl: string;
        policy: string;
        signature: string;
        url: string;
        cdn: string;

        /* @ngInject */
        constructor($log: ng.ILogService, $http: ng.IHttpService, API_URL: string) {
            var requestConfig: ng.IRequestConfig = {
                method: 'GET',
                url: API_URL + '/s3policy'
            };
            $http(requestConfig).success((response: any) => {
                this.policy = response.policy;
                this.signature = response.signature;
                this.key = response.key;
                this.url = response.url;
                this.cdn = response.cdn;
            });
            this.acl = 'public-read';
        }
    }

    angular.module('op.common')
        .service('S3', S3)
}
