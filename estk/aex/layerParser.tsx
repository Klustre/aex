function layerParser(options: AexOptions) {
    const propertyParsing = propertyParser(options);

    return {
        parseLayerAttributes(layer: Layer): AexLayerAttributes {
            const containingComp = layer.containingComp;

            const name = layer.name;
            const label = layer.label;
            let layerType = 'Layer' as AexLayerType;

            const comment = getModifiedValue(layer.comment, '');
            let hasVideo = getModifiedValue(layer.hasVideo, true);
            const inPoint = getModifiedValue(layer.inPoint, 0);
            const outPoint = getModifiedValue(layer.outPoint, containingComp.duration);
            const startTime = getModifiedValue(layer.startTime, 0);
            const stretch = getModifiedValue(layer.stretch, 100);
            const nullLayer = getModifiedValue(layer.nullLayer, false);
            const shy = getModifiedValue(layer.shy, false);
            const solo = getModifiedValue(layer.solo, false);

            const parentLayerIndex = layer.parent ? layer.parent.index : undefined;

            if (aeq.isShapeLayer(layer)) {
                layerType = 'ShapeLayer';
            }

            if (aeq.isCameraLayer(layer)) {
                hasVideo = getModifiedValue(layer.hasVideo, false);
                layerType = 'CameraLayer';
            }

            return {
                name,
                label,
                layerType,

                comment,
                hasVideo,
                inPoint,
                outPoint,
                startTime,
                stretch,
                nullLayer,
                shy,
                solo,
                parentLayerIndex,
            };
        },
        parseAVLayerAttributes(layer: AVLayer): AexAVLayerAttributes {
            const layerAttributes = this.parseLayerAttributes(layer);
            layerAttributes.layerType = 'AVLayer';

            /** @todo Handle track matte */
            /** @todo Handle source */
            const source = layer.source;

            const adjustmentLayer = getModifiedValue(layer.adjustmentLayer, false);
            const audioEnabled = getModifiedValue(layer.audioEnabled, true);
            const autoOrient = getModifiedValue(layer.autoOrient, AutoOrientType.NO_AUTO_ORIENT);
            const blendingMode = getModifiedValue(layer.blendingMode, BlendingMode.NORMAL);
            const collapseTransformation = getModifiedValue(layer.collapseTransformation, false);
            const effectsActive = getModifiedValue(layer.effectsActive, true);
            const environmentLayer = getModifiedValue(layer.environmentLayer, false);
            const frameBlending = getModifiedValue(layer.frameBlending, false);
            const frameBlendingType = frameBlending ? getModifiedValue(layer.frameBlendingType, FrameBlendingType.NO_FRAME_BLEND) : undefined;
            const guideLayer = getModifiedValue(layer.guideLayer, false);
            const motionBlur = getModifiedValue(layer.motionBlur, false);
            const preserveTransparency = getModifiedValue(layer.preserveTransparency, false);
            const quality = getModifiedValue(layer.quality, LayerQuality.BEST);
            const samplingQuality = getModifiedValue(layer.samplingQuality, LayerSamplingQuality.BILINEAR);
            const threeDLayer = getModifiedValue(layer.threeDLayer, false);
            const timeRemapEnabled = getModifiedValue(layer.timeRemapEnabled, false);
            const trackMatteType = getModifiedValue(layer.trackMatteType, TrackMatteType.NO_TRACK_MATTE);

            return {
                ...layerAttributes,

                adjustmentLayer,
                audioEnabled,
                autoOrient,
                blendingMode,
                collapseTransformation,
                effectsActive,
                environmentLayer,
                frameBlending,
                frameBlendingType,
                guideLayer,
                motionBlur,
                preserveTransparency,
                quality,
                samplingQuality,
                threeDLayer,
                timeRemapEnabled,
                trackMatteType,
            };
        },
        parseLightLayerAttributes(layer: LightLayer): AexLightLayerAttributes {
            const layerAttributes = this.parseLayerAttributes(layer);
            layerAttributes.layerType = 'LightLayer';
            layerAttributes.hasVideo = getModifiedValue(layer.hasVideo, false);

            const lightType = layer.lightType;
            return {
                ...layerAttributes,
                lightType,
            };
        },
        parseTextLayerAttributes(layer: TextLayer): AexTextLayerAttributes {
            const layerAttributes = this.parseLayerAttributes(layer);
            layerAttributes.layerType = 'TextLayer';

            const threeDPerChar = layer.threeDLayer ? getModifiedValue(layer.threeDPerChar, false) : undefined;
            return {
                ...layerAttributes,
                threeDPerChar,
            };
        },

        parseTransform(layer: Layer): AexTransform {
            const transformGroup = layer.transform;

            const anchorPoint = propertyParsing.getModifiedProperty(transformGroup.anchorPoint);
            const position = propertyParsing.getModifiedProperty(transformGroup.position);
            const scale = propertyParsing.getModifiedProperty(transformGroup.scale);
            let rotation = propertyParsing.getModifiedProperty(transformGroup.rotation);
            const opacity = propertyParsing.getModifiedProperty(transformGroup.opacity);

            let pointOfInterest;
            let orientation;
            let xRotation;
            let yRotation;

            if (aeq.isCamera(layer) || aeq.isLight(layer) || (aeq.isAVLayer(layer) && layer.threeDLayer)) {
                pointOfInterest = propertyParsing.getModifiedProperty(transformGroup.pointOfInterest);
                orientation = propertyParsing.getModifiedProperty(transformGroup.orientation);
                xRotation = propertyParsing.getModifiedProperty(transformGroup.xRotation);
                yRotation = propertyParsing.getModifiedProperty(transformGroup.yRotation);
                rotation = propertyParsing.getModifiedProperty(transformGroup.zRotation);
            }

            return {
                anchorPoint,
                position,
                scale,
                rotation,
                opacity,
                pointOfInterest,
                orientation,
                xRotation,
                yRotation,
            };
        },
        parseMasks(maskGroup: PropertyGroup): AexProperties[] {
            let masks = [];

            for (let ii = 1, il = maskGroup.numProperties; ii <= il; ii++) {
                const mask = maskGroup.property(ii) as MaskPropertyGroup;

                const { name, color } = mask;

                const maskMode = getModifiedValue(mask.maskMode, MaskMode.ADD);
                const inverted = getModifiedValue(mask.inverted, false);
                const rotoBezier = getModifiedValue(mask.rotoBezier, false);
                const maskMotionBlur = getModifiedValue(mask.maskMotionBlur, MaskMotionBlur.SAME_AS_LAYER);
                const locked = getModifiedValue(mask.locked, false);

                const maskPath = propertyParsing.getModifiedProperty(mask.maskPath);
                const maskFeather = propertyParsing.getModifiedProperty(mask.maskFeather);
                const maskOpacity = propertyParsing.getModifiedProperty(mask.maskOpacity);
                const maskExpansion = propertyParsing.getModifiedProperty(mask.maskExpansion);

                masks.push({
                    name,
                    maskMode,
                    inverted,
                    rotoBezier,
                    maskMotionBlur,
                    locked,
                    color,
                    maskPath,
                    maskFeather,
                    maskOpacity,
                    maskExpansion,
                });
            }

            return masks;
        },
        parseEffects(effectsGroup: PropertyGroup): AexProperties[] {
            let effects = [];
            for (let ii = 1, il = effectsGroup.numProperties; ii <= il; ii++) {
                const effect = effectsGroup.property(ii) as PropertyGroup;

                const { name, matchName, enabled } = effect;

                let properties = propertyParsing.parsePropertyGroup(effect);

                effects.push({
                    name,
                    matchName,
                    enabled,

                    properties,
                });
            }
            return effects;
        },
        parseLayerProperties(layer: Layer): AexLayerProperties {
            let transform = this.parseTransform(layer);

            let markers;
            if (layer.marker.isModified) {
                markers = propertyParsing.parseMarkers(layer.marker);
            }

            let audio;
            let geometryOption;
            let layerStyles;
            let materialOption;
            let timeRemap;
            let masks;
            let effects;
            if (isVisibleLayer(layer)) {
                if (aeq.isAVLayer(layer)) {
                    if (layer.timeRemapEnabled) {
                        timeRemap = propertyParsing.getModifiedProperty(layer.timeRemap);
                    }

                    if (layer.hasAudio) {
                        audio = propertyParsing.parsePropertyGroup(layer.audio);
                    }

                    if (aeq.isTextLayer(layer)) {
                    }

                    if (aeq.isShapeLayer(layer)) {
                    }
                }

                // User has added layer styles, so check them
                if (layer.layerStyle.canSetEnabled) {
                    layerStyles = {
                        enabled: layer.layerStyle.enabled,
                        ...propertyParsing.parsePropertyGroup(layer.layerStyle),
                    };

                    if (layerStyles.hasOwnProperty('patternFill/enabled')) {
                        delete layerStyles['patternFill/enabled'];
                    }
                }

                if (layer.threeDLayer) {
                    materialOption = propertyParsing.parsePropertyGroup(layer.materialOption);
                    geometryOption = propertyParsing.parsePropertyGroup(layer.geometryOption);
                }

                let maskGroup = layer.mask;
                if (maskGroup.isModified) {
                    masks = this.parseMasks(maskGroup);
                }

                let effectsGroup = layer.effect;
                if (effectsGroup.isModified) {
                    effects = this.parseEffects(effectsGroup);
                }
            }

            return {
                transform,
                markers,
                audio,
                geometryOption,
                layerStyles,
                materialOption,
                timeRemap,
                masks,
                effects,
            };
        },
    };
}
