function _isObjectEqual(a: object, b: object): boolean {
    if (typeof b !== 'object') {
        return false;
    }

    for (let key in a) {
        if (!a.hasOwnProperty(key)) {
            continue;
        }

        if (!b.hasOwnProperty(key)) {
            return false;
        }

        const srcValue = a[key];
        const destValue = b[key];

        if (!_isEqual(srcValue, destValue)) {
            return false;
        }
    }

    return true;
}

function _isArrayEqual(a: any[], b: any[]): boolean {
    if (!(b instanceof Array) || a.length !== b.length) {
        return false;
    }

    for (let ii = 0, il = a.length; ii < il; ii++) {
        let elementA = a[ii];
        let elementB = b[ii];

        if (!_isEqual(elementA, elementB)) {
            return false;
        }
    }

    return true;
}

/** true if identical */
function _isEqual(a: any, b: any): boolean {
    if (a instanceof Array) {
        return _isArrayEqual(a, b);
    } else if (typeof a === 'object') {
        return _isObjectEqual(a, b);
    } else {
        return a === b;
    }
}

/**
 * Gets the value of a property if it's different than the internal AE
 * default. This is useful b/c it helps keep the serialized objects
 * small.
 *
 * @param value Property value from AfterEffects
 * @param aeDefaultValue The expected default value provided by AE for the property
 * @returns The property value if and only if the property exists and is
 * set to something other than the default.
 */
function getModifiedValue<T>(value: T, aeDefaultValue: T): T | undefined {
    if (aeq.isNullOrUndefined(value)) {
        return undefined;
    }

    return _isEqual(value, aeDefaultValue) ? undefined : value;
}

/**
 * Gets the value of a property if and only if another boolean property is set
 * that dictates if and how it should be read.
 *
 * @param shouldRead Property from AfterEffects that decides if the value should be read.
 * @param callback Function that gets the value that should read
 * @param aeDefaultValue The expected default value provided by AE for the property
 * @returns The property value if and only if the property exists and is
 * set to something other than the default.
 */
function getBoundModifiedValue<T>(shouldRead: boolean, callback: () => T, aeDefaultValue: T): T | undefined {
    // zlovatt: Maybe we should return the default value in these cases instead of undefined?
    return shouldRead ? getModifiedValue<T>(callback(), aeDefaultValue) : undefined;
}

function sourceIsSolid(source: any): source is SolidSource {
    // @ts-ignore
    return source instanceof SolidSource;
}

function sourceIsFile(source: any): source is FileSource {
    // @ts-ignore
    return source instanceof FileSource;
}

function sourceIsPlaceholder(source: any): source is PlaceholderSource {
    // @ts-ignore
    return source instanceof PlaceholderSource;
}

function isProject(item: any): item is Project {
    // @ts-ignore
    return item instanceof Project;
}

function isVisibleLayer(layer: Layer): layer is AVLayer | TextLayer | ShapeLayer {
    return aeq.isAVLayer(layer) || aeq.isTextLayer(layer) || aeq.isShapeLayer(layer);
}

function isNullLayer(layer: Layer): layer is Layer {
    return layer.nullLayer;
}

function isEffectPropertyGroup(property: Property): boolean {
    const { propertyDepth, propertyValueType } = property;

    return propertyValueType === PropertyValueType.NO_VALUE && propertyDepth > 2 && property.propertyGroup(propertyDepth - 2).isEffect;
}

type ForEachPropertyGroupCallback<T> = (effect: Property | T, i: number, length: number) => void;

function forEachPropertyInGroup<T extends PropertyGroup = PropertyGroup>(group: PropertyGroup, callback: ForEachPropertyGroupCallback<T>) {
    for (let ii = 1, il = group.numProperties; ii <= il; ii++) {
        const property = group.property(ii) as Property | T;

        callback(property, ii - 1, il);
    }
}

type ForEachPropertyKeyValueCallback<T> = (value: T, i: number, length: number) => void;

function forEachPropertyKeyValue<T>(property: Property, callback: ForEachPropertyKeyValueCallback<T>) {
    for (let ii = 1, il = property.numKeys; ii <= il; ii++) {
        const keyValue: T = property.keyValue(ii);

        callback(keyValue as T, ii - 1, il);
    }
}
