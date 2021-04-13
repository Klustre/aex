function _getShapeLayer(layer: ShapeLayer, state: AexState): AexShapeLayer {
    const avLayerAttributes = _getAVLayer(layer, state);

    return {
        ...avLayerAttributes,
        type: AEX_SHAPE_LAYER,
        contents: _getContents(layer, state),
    };
}

function _getContents(layer: ShapeLayer, state: AexState): AexShapePropertyGroup[] {
    const vectorsGroups = layer.property('ADBE Root Vectors Group') as PropertyGroup;

    const callback: CustomPropertyHandler<AexShapePropertyGroup> = (propertyGroup, aexPropertyGroup) => {
        if (isVectorGroup(propertyGroup)) {
            aexPropertyGroup.contents = getVectorsGroup(propertyGroup, callback, state);
        }
    };

    return _getUnnestedPropertyGroup<AexShapePropertyGroup>(vectorsGroups, callback, state);
}
