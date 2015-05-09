module op.common {
    export interface IPot {
        id: string;
        cook: string;
        consumer: string;
        name: string;
        description: string;
        address: string;
        user?: IUser;
        image?: File;

        setPot: (pot: IPot) => void;
    }

    export class Pot implements IPot {
        id: string;
        cook: string;
        consumer: string;
        name: string;
        description: string;
        address: string;
        image: File;

        constructor(obj?: any) {
            this.setPot(obj)
        }

        setPot(obj?: any): void {
            this.id = obj && obj.id;
            this.cook = obj && obj.cook;
            this.consumer = obj && obj.consumer;
            this.name = obj && obj.name;
            this.description = obj && obj.description;
            this.address = obj && obj.address;
            this.image = obj && obj.image;
        }
    }

    angular.module('op.common')
        .constant('Pot', Pot);
}
