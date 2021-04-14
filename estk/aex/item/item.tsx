function getAexItem(item: Item, state: AexState): AexItemBase {
    if (aeq.isComp(item)) {
        return getAexComp(item as CompItem, state);
    } else if (aeq.isFootageItem(item)) {
        return _getFootageItem(item, state);
    } else if (aeq.isFolderItem(item)) {
        return _getFolderItem(item, state);
    } else {
        throw new Error(`Unrecognized Item Type`);
    }
}

function createAexItem(aexItem: AexItem, state: AexState): void {
    switch (aexItem.type) {
        case AEX_FILE_FOOTAGE_ITEM:
        case AEX_SOLID_ITEM:
        case AEX_PLACEHOLDER_ITEM:
            return _createFootageItem(aexItem, state);
        case AEX_FOLDER_ITEM:
            return _createFolderItem(aexItem, state);
        default:
            throw new Error(`Unrecognized Item Type ${aexItem.type}`);
    }
}

function _getItemAttributes(item: Item): AexItemBase {
    /**
     * @todo Add AexOption to preserve project folder structure.
     * For now, just get the immediate parent folder name & assume lives in root
     */
    return {
        name: item.name,
        comment: getModifiedValue(item.comment, ''),
        label: getModifiedValue(item.label, 15),
        folder: _getParentFolders(item),

        aexid: generateItemUID(item),
    };
}

function _setItemAttributes(item: Item, aexItem: AexItem): void {
    cloneAttributes(item, aexItem);
    _setParentFolders(item, aexItem.folder);
}

function _getParentFolders(item: Item): string[] {
    const folders = [];

    let parent = item.parentFolder;

    while (parent !== app.project.rootFolder) {
        folders.push(parent.name);
        parent = parent.parentFolder;
    }

    return folders;
}

function _setParentFolders(item: Item, folders: string[]): void {
    let root = app.project.rootFolder;

    folders.reverse();

    aeq.forEach(folders, (folder) => {
        const newFolder = aeq.project.getOrCreateFolder(folder, root);
        item.parentFolder = newFolder;

        root = newFolder;
    });
}

function generateItemUID(item: Item): string {
    if (!!item) {
        return `${item.name.toLowerCase()}:${item.id}`;
    } else {
        return undefined;
    }
}
