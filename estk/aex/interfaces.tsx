type Serializable = Project | CompItem | Layer | Property<any>;

type AexLayerType = 'Layer' | 'CameraLayer' | 'LightLayer' | 'AVLayer' | 'ShapeLayer' | 'TextLayer';
type AexItemType = 'Folder' | 'Footage' | 'Comp' | 'Solid' | 'Placeholder';

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
    itemType: AexItemType;
}

interface AexAVItemAttributes extends Partial<AexItemAttributes> {
    duration: number;
    frameRate: number;
    height: number;
    pixelAspect: number;
    width: number;
}

interface AexCompItemAttributes extends Partial<AexAVItemAttributes> {
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

interface AexFootageItemAttributes extends Partial<AexAVItemAttributes>, Partial<AexFileSourceAttributes>, Partial<AexSolidSourceAttributes> {
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

interface AexComp extends Partial<AexCompItemAttributes> {
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
    parentLayerIndex: number;
}

interface AexAVLayerAttributes extends Partial<AexLayerAttributes> {
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

interface AexLightLayerAttributes extends Partial<AexLayerAttributes> {
    lightType: LightType;
}

interface AexTextLayerAttributes extends Partial<AexLayerAttributes> {
    threeDPerChar: boolean;
}

interface AexLayer extends Partial<AexAVLayerAttributes>, Partial<AexLightLayerAttributes>, Partial<AexTextLayerAttributes> {
    layerType: AexLayerType;
    properties: AexProperties;
}

interface AexProperties {
    [name: string]: AexProperty;
}

interface AexProperty {}

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
