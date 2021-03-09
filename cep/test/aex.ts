import { evalScript } from './csinterface';

export enum AeObject {
    ActiveComp = 'app.project.activeItem',
}

export function aex() {
    return {
        async toObject(item: any) {
            if (typeof item === 'string') {
                return await evalScript(`aex().toObject("${item.toString()}")`);
            } else {
                return await evalScript(`aex().toObject(${item || 'undefined'})`);
            }
        },
        async toObjectWithAeObject(aeobject: AeObject) {
            switch (aeobject) {
                case AeObject.ActiveComp:
                    return await evalScript(`aex().toObject(${aeobject})`);
                default:
                    throw new Error(`Unrecognized AE Object - ${aeobject}`);
            }
        },
    };
}
