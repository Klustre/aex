type Serializable = Project | CompItem | Layer | Property<any>;

type AexLayerType = 'Layer' | 'CameraLayer' | 'LightLayer' | 'AVLayer' | 'ShapeLayer' | 'TextLayer';
type AexItemType = 'Folder' | 'Footage' | 'Comp' | 'Solid' | 'Placeholder';
type AexValueType = number | [number, number] | [number, number, number] | [number, number, number, number] | MarkerValue | Shape | TextDocument;

interface AexOptions {}

interface AexProject {
    items: Partial<AexItem>[];
    comps: Partial<AexComp>[];
}

interface AexItemAttributes {
    comment: string;
    label: number;
    name: string;
    folder: string;

    /** AEX-specific properties */
    itemType: AexItemType;
}

interface AexAVItemAttributes extends AexItemAttributes {
    duration: number;
    frameRate: number;
    height: number;
    pixelAspect: number;
    width: number;
}

interface AexCompItemAttributes extends AexAVItemAttributes {
    bgColor: number[];
    displayStartFrame: number;
    displayStartTime: number;
    draft3d: boolean;
    dropFrame: boolean;
    frameBlending: boolean;
    hideShyLayers: boolean;
    motionBlur: boolean;
    motionBlurAdaptiveSampleLimit: number;
    motionBlurSamplesPerFrame: number;
    preserveNestedFrameRate: boolean;
    preserveNestedResolution: boolean;
    renderer: string;
    resolutionFactor: number[];
    shutterAngle: number;
    shutterPhase: number;
    workAreaDuration: number;
    workAreaStart: number;
}

interface AexItem extends Partial<AexFootageItemAttributes>, Partial<AexComp> {}

interface AexFootageItemAttributes extends AexAVItemAttributes, AexFileSourceAttributes, AexSolidSourceAttributes {
    alphaMode: AlphaMode;
    conformFrameRate: number;
    fieldSeparationType: FieldSeparationType;
    highQualityFieldSeparation: boolean;
    loop: number;
    premulColor: number[];
    removePulldown: PulldownPhase;
    invertAlpha: boolean;
}

interface AexFileSourceAttributes {
    /** Path to file */
    file: string;
}

interface AexSolidSourceAttributes {
    color: number[];
}

interface AexComp extends AexCompItemAttributes {
    layers: AexLayer[];
    markers: AexMarkerProperty[];
    essentialProps: any[];
}

interface AexLayerAttributes {
    name: string;
    label: number;
    comment: string;
    hasVideo: boolean;
    inPoint: number;
    outPoint: number;
    startTime: number;
    stretch: number;
    nullLayer: boolean;
    shy: boolean;
    solo: boolean;

    /** AEX-specific properties */
    parentLayerIndex: number;
    layerType: AexLayerType;
}

interface AexAVLayerAttributes extends AexLayerAttributes {
    adjustmentLayer: boolean;
    audioEnabled: boolean;
    autoOrient: AutoOrientType;
    blendingMode: BlendingMode;
    collapseTransformation: boolean;
    effectsActive: boolean;
    environmentLayer: boolean;
    frameBlending: boolean;
    frameBlendingType: FrameBlendingType;
    guideLayer: boolean;
    motionBlur: boolean;
    preserveTransparency: boolean;
    quality: LayerQuality;
    samplingQuality: LayerSamplingQuality;
    threeDLayer: boolean;
    timeRemapEnabled: boolean;
    trackMatteType: TrackMatteType;
}

interface AexLightLayerAttributes extends AexLayerAttributes {
    lightType: LightType;
}

interface AexTextLayerAttributes extends AexLayerAttributes {
    threeDPerChar: boolean;
}

interface AexLayer extends Partial<AexAVLayerAttributes>, Partial<AexLightLayerAttributes>, Partial<AexTextLayerAttributes> {
    properties: AexLayerProperties;
}

interface AexLayerProperties {
    audio: AexProperties;
    geometryOption: AexProperties;
    layerStyles: AexProperties;
    markers: AexMarkerProperty;
    materialOption: AexProperties;
    timeRemap: AexProperty<number>;
    transform: AexTransform;
    masks: AexProperties[];
}

interface AexProperties {
    [name: string]: AexProperty<any> | AexProperties;
}

interface AexPropertyBase {
    enabled: boolean;
    matchName: string;
    name: string;
}

interface AexProperty<T> extends AexPropertyBase {
    expression: string;
    expressionEnabled: boolean;
    value: T;

    /** AEX-specific properties */
    keys: AEQKeyInfo[];
}

interface AexMarkerProperty {
    time: number;
    comment: string;
    chapter: string;
    url: string;
    frameTarget: string;
    cuePointName: string;
    duration: number;
    parameters: object;
    label: number;
    protectedRegion: boolean;
}

interface AexTransform {
    anchorPoint: AexProperty<[number, number] | [number, number, number]>;
    position: AexProperty<[number, number] | [number, number, number]>;
    scale: AexProperty<[number, number] | [number, number, number]>;
    pointOfInterest: AexProperty<[number, number, number]>;
    orientation: AexProperty<[number, number, number]>;
    xRotation: AexProperty<number>;
    yRotation: AexProperty<number>;
    rotation: AexProperty<number>;
    opacity: AexProperty<number>;
}
