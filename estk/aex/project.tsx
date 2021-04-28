function getAexProject(project: Project, state: AexState): AexProject {
    const items = aeq.getItems().filter((item) => !aeq.isComp(item));
    const comps = aeq.getComps();

    const aexProject: AexProject = {
        type: AEX_PROJECT,

        items: items.map((item) => getAexItem(item, state)),
        comps: comps.map((comp) => getAexComp(comp, state)),
    };

    return aexProject;
}

function setAeProject(aeProject: Project, aexProject: AexProject, state: AexState) {
    const aexItemsByName = groupArrayBy(aexProject.items, (v) => v.name);
    const aeItemsByName = groupArrayBy(aeq.getItems(), (v) => v.name);

    forEachPairByGroup(aexItemsByName, aeItemsByName, (aexItem, aeItem) => _setAeProjectItem(aexItem, aeItem, state));

    const aexCompsByName = groupArrayBy(aexProject.comps, (v) => v.name);
    const aeCompsByName = groupArrayBy(aeq.getComps(), (v) => v.name);

    forEachPairByGroup(aexCompsByName, aeCompsByName, (aexComp, aeComp) => _setAeProjectComp(aeComp, aexComp, state));
}

/** Should this live in aex/item/item.tsx ? */
function _setAeProjectItem(aexItem: AexItem, aeItem: Item, state: AexState) {
    switch (aexItem.type) {
        case AEX_FILE_FOOTAGE_ITEM:
        case AEX_SOLID_ITEM:
        case AEX_PLACEHOLDER_ITEM:
            if (!aeItem) {
                _createAeFootageItem(aexItem as AexFootageItem, state);
            } else {
                setAeFootageItem(aeItem as FootageItem, aexItem as AexFootageItem, state);
            }
            break;
        case AEX_FOLDER_ITEM:
            aeItem = aeItem || _createAeFolderItem(aexItem as AexFolderItem, state);
            setAeFolderItem(aeItem as FolderItem, aexItem as AexFolderItem, state);
            break;
        case AEX_COMP_ITEM:
            throw new Error(`A comp with name "${(aexItem as AexComp).name}" was found in the item list that should only contain non-comp items`);
        default:
            throw new Error(`Not supported: Setting of project item type "${aexItem.type}"`);
    }
}

function _setAeProjectComp(aeComp: CompItem, aexComp: AexComp, state: AexState) {
    aeComp = aeComp || _createAeComp(aexComp, state);

    _setAeComp(aeComp, aexComp, state);
}
