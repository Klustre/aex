import { AeObject, aex } from '../aex';
import {
    AEX_COLOR_PROPERTY,
    AEX_ONED_PROPERTY,
    AEX_THREED_PROPERTY,
    AEX_TWOD_PROPERTY,
    AEX_CUSTOM_PROPERTY,
    AEX_DROPDOWN_PROPERTY,
} from '../constants';
import { cleanupAex, evalAexIntoEstk, openProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('Layer Effects', function () {
    this.slow(500);
    this.timeout(3000);

    let puppetComp: any;
    let simpleComp: any;
    let rotobrushComp: any;

    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/layer_effects.aep');
        const result = await aex().fromAeObject(AeObject.Project);
        const project = result.object;
        puppetComp = project.comps.find((comp: any) => comp.name === 'Puppet Pins');
        simpleComp = project.comps.find((comp: any) => comp.name === 'Simple');
        rotobrushComp = project.comps.find((comp: any) => comp.name === 'Rotobrush');
        console.log('layer_effects', project);
    });

    after(async () => {
        await cleanupAex();
    });

    it('Can parse simple unmodified effect', async () => {
        assertAreEqual(simpleComp.layers[0].effects[0], {
            matchName: 'ADBE Fill',
            name: 'Fill - Default',
        });
    });

    it('Can parse simple modified effect', async () => {
        assertAreEqual(simpleComp.layers[0].effects[1], {
            matchName: 'ADBE Fill',
            name: 'Fill - Modified',
            properties: [
                {
                    keys: [],
                    matchName: 'ADBE Fill-0007',
                    name: 'All Masks',
                    type: AEX_ONED_PROPERTY,
                    value: 1,
                },
                {
                    keys: [],
                    matchName: 'ADBE Fill-0002',
                    name: 'Color',
                    type: AEX_COLOR_PROPERTY,
                    value: [1, 0.5, 0, 1],
                },
                {
                    keys: [],
                    matchName: 'ADBE Fill-0006',
                    name: 'Invert',
                    type: AEX_ONED_PROPERTY,
                    value: 1,
                },
                {
                    keys: [],
                    matchName: 'ADBE Fill-0003',
                    name: 'Horizontal Feather',
                    type: AEX_ONED_PROPERTY,
                    value: 2.2,
                },
                {
                    keys: [],
                    matchName: 'ADBE Fill-0004',
                    name: 'Vertical Feather',
                    type: AEX_ONED_PROPERTY,
                    value: 2.8,
                },
                {
                    keys: [],
                    matchName: 'ADBE Fill-0005',
                    name: 'Opacity',
                    type: AEX_ONED_PROPERTY,
                    value: 0.79,
                },
            ],
        });
    });

    it('Can parse effect compositing options', async () => {
        assertAreEqual(simpleComp.layers[0].effects[2], {
            matchName: 'ADBE Fill',
            name: 'Fill - Compositing Options',
            properties: [
                {
                    matchName: 'ADBE Effect Built In Params',
                    properties: [
                        {
                            matchName: 'ADBE Effect Mask Parade',
                            properties: [
                                {
                                    matchName: 'ADBE Effect Mask',
                                    name: 'Mask Reference 1',
                                    properties: [
                                        {
                                            keys: [],
                                            matchName: 'ADBE Effect Path Stream Ref',
                                            name: 'Mask Reference 1',
                                            type: AEX_ONED_PROPERTY,
                                            value: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            keys: [],
                            matchName: 'ADBE Effect Mask Opacity',
                            name: 'Effect Opacity',
                            type: AEX_ONED_PROPERTY,
                            value: 50,
                        },
                    ],
                },
            ],
        });
    });

    it('Can parse default expression controls', async () => {
        assertAreEqual(simpleComp.layers[1].effects, [
            {
                name: '3D Point Control',
                matchName: 'ADBE Point3D Control',
            },
            {
                name: 'Angle Control',
                matchName: 'ADBE Angle Control',
            },
            {
                name: 'Checkbox Control',
                matchName: 'ADBE Checkbox Control',
            },
            {
                name: 'Color Control',
                matchName: 'ADBE Color Control',
            },
            {
                name: 'Dropdown Menu Control',
                matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ',
                properties: [
                    {
                        items: ['Item 1', 'Item 2', 'Item 3'],
                        type: AEX_DROPDOWN_PROPERTY,
                    },
                ],
            },
            {
                name: 'Layer Control',
                matchName: 'ADBE Layer Control',
            },
            {
                name: 'Point Control',
                matchName: 'ADBE Point Control',
            },
            {
                name: 'Slider Control',
                matchName: 'ADBE Slider Control',
            },
        ]);
    });

    it('Can parse modified expression controls', async () => {
        assertAreEqual(simpleComp.layers[2].effects, [
            {
                name: '3D Point Control',
                matchName: 'ADBE Point3D Control',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Point3D Control-0001',
                        name: '3D Point',
                        type: AEX_THREED_PROPERTY,
                        value: [0, 0, 0],
                    },
                ],
            },
            {
                name: 'Angle Control',
                matchName: 'ADBE Angle Control',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Angle Control-0001',
                        name: 'Angle',
                        type: AEX_ONED_PROPERTY,
                        value: 100,
                    },
                ],
            },
            {
                name: 'Checkbox Control',
                matchName: 'ADBE Checkbox Control',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Checkbox Control-0001',
                        name: 'Checkbox',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                ],
            },
            {
                name: 'Color Control',
                matchName: 'ADBE Color Control',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Color Control-0001',
                        name: 'Color',
                        type: AEX_COLOR_PROPERTY,
                        value: [0, 0.5, 1, 1],
                    },
                ],
            },
            {
                name: 'Dropdown Menu Control',
                matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ',
                properties: [
                    {
                        keys: [],
                        items: ['Item 1', 'Item 2', 'Item 3'],
                        matchName: 'Pseudo/@@DJHhoqupT8S4IxJ3m0KmfQ-0001',
                        name: 'Menu',
                        type: AEX_DROPDOWN_PROPERTY,
                        value: 3,
                    },
                ],
            },
            {
                name: 'Layer Control',
                matchName: 'ADBE Layer Control',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Layer Control-0001',
                        name: 'Layer',
                        type: AEX_ONED_PROPERTY,
                        value: 1,
                    },
                ],
            },
            {
                name: 'Point Control',
                matchName: 'ADBE Point Control',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Point Control-0001',
                        name: 'Point',
                        type: AEX_TWOD_PROPERTY,
                        value: [100, 200],
                    },
                ],
            },
            {
                name: 'Slider Control',
                matchName: 'ADBE Slider Control',
                properties: [
                    {
                        keys: [],
                        matchName: 'ADBE Slider Control-0001',
                        name: 'Slider',
                        type: AEX_ONED_PROPERTY,
                        value: 300,
                    },
                ],
            },
        ]);
    });

    it('Can parse nested effect groups', async () => {
        assertAreEqual(simpleComp.layers[3].effects[0], {
            matchName: 'ADBE Fractal Noise',
            name: 'Fractal Noise',
            properties: [
                {
                    keys: [],
                    matchName: 'ADBE Fractal Noise-0010',
                    name: 'Scale',
                    type: AEX_ONED_PROPERTY,
                    value: 123,
                },
            ],
        });
    });

    it('Can parse puppet pins', async () => {
        assertAreEqual(puppetComp.layers[0].effects[0], {
            name: 'Puppet',
            matchName: 'ADBE FreePin3',
            properties: [
                {
                    matchName: 'ADBE FreePin3 ARAP Group',
                    properties: [
                        {
                            matchName: 'ADBE FreePin3 Mesh Group',
                            properties: [
                                {
                                    matchName: 'ADBE FreePin3 Mesh Atom',
                                    name: 'Custom Mesh Name',
                                    properties: [
                                        {
                                            type: 'aex:property:oned',
                                            name: 'Triangles',
                                            matchName: 'ADBE FreePin3 Mesh Tri Count',
                                            value: 50,
                                            keys: [],
                                        },
                                        {
                                            matchName: 'ADBE FreePin3 PosPins',
                                            properties: [
                                                {
                                                    matchName: 'ADBE FreePin3 PosPin Atom',
                                                    name: 'Puppet Pin 2',
                                                    properties: [
                                                        {
                                                            type: 'aex:property:oned',
                                                            name: 'Vertex Index',
                                                            matchName: 'ADBE FreePin3 PosPin Vtx Index',
                                                            value: 12,
                                                            keys: [],
                                                        },
                                                        {
                                                            type: 'aex:property:twod',
                                                            name: 'Position',
                                                            matchName: 'ADBE FreePin3 PosPin Position',
                                                            value: [13, 482],
                                                            keys: [],
                                                        },
                                                    ],
                                                },
                                                {
                                                    matchName: 'ADBE FreePin3 PosPin Atom',
                                                    name: 'Custom Pin 1',
                                                    properties: [
                                                        {
                                                            type: 'aex:property:oned',
                                                            name: 'Vertex Index',
                                                            matchName: 'ADBE FreePin3 PosPin Vtx Index',
                                                            value: 13,
                                                            keys: [],
                                                        },
                                                        {
                                                            type: 'aex:property:twod',
                                                            name: 'Position',
                                                            matchName: 'ADBE FreePin3 PosPin Position',
                                                            value: [15, 14],
                                                            keys: [
                                                                {
                                                                    value: [15, 14],
                                                                    time: 0,
                                                                    interpolationType: {},
                                                                    temporalEase: {
                                                                        inEase: [
                                                                            {
                                                                                influence: 16.666666667,
                                                                                speed: 0,
                                                                            },
                                                                        ],
                                                                        outEase: [
                                                                            {
                                                                                influence: 16.666666667,
                                                                                speed: 147.692307692308,
                                                                            },
                                                                        ],
                                                                    },
                                                                    spatialTangent: {
                                                                        inTangent: [0, 0],
                                                                        outTangent: [0, 0],
                                                                    },
                                                                    spatialContinuous: true,
                                                                },
                                                                {
                                                                    value: [15, 254],
                                                                    time: 1.625,
                                                                    interpolationType: {},
                                                                    temporalEase: {
                                                                        inEase: [
                                                                            {
                                                                                influence: 16.666666667,
                                                                                speed: 147.692307692308,
                                                                            },
                                                                        ],
                                                                        outEase: [
                                                                            {
                                                                                influence: 16.666666667,
                                                                                speed: 0,
                                                                            },
                                                                        ],
                                                                    },
                                                                    spatialTangent: {
                                                                        inTangent: [0, 0],
                                                                        outTangent: [0, 0],
                                                                    },
                                                                    spatialContinuous: true,
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });

    it('Can parse rotobrush effect', async () => {
        assertAreEqual(rotobrushComp.layers[0].effects[0], {
            name: 'Roto Brush & Refine Edge',
            matchName: 'ADBE Samurai',
            properties: [
                {
                    matchName: 'ADBE Samurai Strokes Group',
                    properties: [
                        {
                            matchName: 'ADBE Paint Atom',
                            name: 'Foreground 1',
                            properties: [
                                {
                                    type: 'aex:property:twod',
                                    name: 'Duration',
                                    matchName: 'ADBE Paint Duration',
                                    value: [0, 1.25],
                                    keys: [],
                                },
                                {
                                    matchName: 'ADBE Paint Properties',
                                    properties: [
                                        {
                                            type: 'aex:property:color',
                                            name: 'Color',
                                            matchName: 'ADBE Paint Color',
                                            value: [0, 1, 0, 1],
                                            keys: [],
                                        },
                                        {
                                            type: 'aex:property:oned',
                                            name: 'Clone Source',
                                            matchName: 'ADBE Paint Clone Layer',
                                            value: 0,
                                            keys: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
});
