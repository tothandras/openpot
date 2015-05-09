module op.common {
    export class S3 {
        AWSAccessKeyId: string;
        acl: string;
        policy: string;
        signature: string;

        constructor() {
            this.acl = 'public-read';
            this.AWSAccessKeyId = '';
        }
    }

    angular.module('op.common')
        .value('S3', new S3())
}
