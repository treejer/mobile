export enum TreeLife {
  Submitted = 'Submitted',
  Drafted = 'Drafted',
}

export enum TreeStatus {
  Pending = 'Pending',
  NotVerified = 'NotVerified',
  Verified = 'Verified',
  Update = 'Update',
}

export const treeInventoryTabs = [
  {
    title: TreeLife.Submitted,
    icon: 'clipboard-check',
  },
  {
    title: TreeLife.Drafted,
    icon: 'cloud-upload-alt',
  },
];
