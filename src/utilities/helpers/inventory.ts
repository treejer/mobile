import {SYNCED} from 'utilities/helpers/inventoryConstants';

export const deleteSyncedAndMigrate = (oldRealm, newRealm, schemaVersion) => {
  if (oldRealm.schemaVersion < schemaVersion) {
    const oldInventoryObject = oldRealm.objects('Inventory');
    const newInventoryObject = newRealm.objects('Inventory');

    const syncedInventoriesIndexToDelete = [];

    for (const index in oldInventoryObject) {
      if (oldInventoryObject[index].status === SYNCED) {
        // @ts-ignore
        syncedInventoriesIndexToDelete.push(index);
      }
    }

    // delete all the synced inventory objects;
    for (let i = syncedInventoriesIndexToDelete.length - 1; i >= 0; i--) {
      newRealm.delete(newInventoryObject[syncedInventoriesIndexToDelete[i]]);
    }
  }
};
