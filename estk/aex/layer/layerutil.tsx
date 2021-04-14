type OnGroupCallback<T extends AexPropertyGroup = AexPropertyGroup> = (propertyGroup: PropertyGroup, aexPropertyGroup: T) => void;
type OnShapeGroupCallback = OnGroupCallback<AexShapePropertyGroup>;

function getUnnestedPropertyGroup<T extends AexPropertyGroup = AexPropertyGroup>(
    propertyGroup: PropertyGroup,
    onGroup: OnGroupCallback<T> | null,
    state: AexState
): T[] {
    onGroup = onGroup || (() => {});
    const result: T[] = [];

    forEachPropertyInGroup(propertyGroup, (childPropertyGroup: PropertyGroup) => {
        const { name, matchName } = childPropertyGroup;
        const enabled = getModifiedValue(childPropertyGroup.enabled, true);
        const aexGroup = {
            name,
            matchName,
            enabled,

            properties: null,
        } as T;

        /**
         * @todo
         * getPropertyGroup() is set up so that if there's no data, it doesn't return the group at all.
         * This means that if there's a layer effect that has defaults, effects: [] will be empty
         * However, we _always_ want to return the effects if they're present, even if the properties are default.
         *
         * This approach below sucks because we're repeating work.
         * Best would be to still return enabled/matchName/name, with an empty properties array.
         * This could be accomplished by adding an optional parameter to getPropertyGroup for whether to return undefined if empty or not
         * In cases like masks & effects, this would be false. Otherwise true.
         */

        onGroup(childPropertyGroup, aexGroup);

        if (aexGroup.properties === null) {
            const propertyData = getPropertyGroup(childPropertyGroup, state);
            aexGroup.properties = propertyData ? propertyData.properties : undefined;
        }

        result.push(aexGroup);
    });

    return result;
}
