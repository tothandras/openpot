module op.common {
    export interface IPot {
        id: string;
        cook: string;
        consumer: string;
        name: string;
        description: string;
        address: string;

        setPot: (pot: IPot) => void;
    }

    export class Pot implements IPot {
        id: string;
        cook: string;
        consumer: string;
        name: string;
        description: string;
        address: string;

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
        }
    }

    angular.module('op.common')
        .constant('Pot', Pot);
}
