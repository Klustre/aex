function getAexFootageItem(item: FootageItem, state: AexState): AexFootageItem {
    const itemSource = item.mainSource;

    if (sourceIsFile(itemSource)) {
        return getAexFileItem(item, state);
    } else if (sourceIsSolid(itemSource)) {
        return getAexSolidItem(item, state);
    } else if (sourceIsPlaceholder(itemSource)) {
        return getAexPlaceholderItem(item, state);
    }
}

function createAeFootageItem(aexFootage: AexFootageItem, state: AexState): FootageItem {
    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            return createAeSolid(aexFootage as AexSolidItem, state);
        case AEX_PLACEHOLDER_ITEM:
            return createAePlaceholder(aexFootage as AexPlaceholderItem, state);
        case AEX_FILE_FOOTAGE_ITEM:
            throw new Error(`TODO: Rafi`);
        default:
            throw new Error(`Unsupported footage type: ${aexFootage.type}`);
    }
}

function updateAeFootageItem(aeFootage: FootageItem, aexFootage: AexFootageItem, state: AexState) {
    switch (aexFootage.type) {
        case AEX_SOLID_ITEM:
            updateAeSolid(aeFootage as FootageItem, aexFootage as AexSolidItem, state);
            break;
        case AEX_PLACEHOLDER_ITEM:
            updateAePlaceholder(aeFootage, aexFootage as AexPlaceholderItem, state);
            break;
        case AEX_FILE_FOOTAGE_ITEM:
            throw new Error(`TODO: Rafi`);
        default:
            throw new Error(`Unsupported footage type: ${aexFootage.type}`);
    }
}

function _getFootageItemAttributes(item: FootageItem, state: AexState): AexFootageItemBase {
    const avItemBaseAttributes = getAVItemBaseAttributes(item);
    const itemSource = item.mainSource;

    const alphaMode = getModifiedValue(itemSource.alphaMode, AlphaMode.STRAIGHT);
    const invertAlpha = _getInvertAlphaValue(itemSource, alphaMode);

    state.stats.nonCompItemCount++;

    return {
        ...avItemBaseAttributes,

        conformFrameRate: getModifiedValue(itemSource.conformFrameRate, 0),
        fieldSeparationType: getModifiedValue(itemSource.fieldSeparationType, FieldSeparationType.OFF),
        highQualityFieldSeparation: getModifiedValue(itemSource.highQualityFieldSeparation, false),
        loop: getModifiedValue(itemSource.loop, 1),
        premulColor: getModifiedValue(itemSource.premulColor, [0, 0, 0] as ThreeDColorValue),
        removePulldown: getModifiedValue(itemSource.removePulldown, PulldownPhase.OFF),
        alphaMode,
        invertAlpha,
    };
}

function _getInvertAlphaValue(itemSource: FileSource | SolidSource | PlaceholderSource, alphaMode: AlphaMode) {
    return itemSource.hasAlpha === false || alphaMode === AlphaMode.IGNORE ? undefined : itemSource.invertAlpha;
}
