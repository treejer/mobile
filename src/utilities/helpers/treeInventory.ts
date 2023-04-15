export enum TreeLife {
  Submitted = 'submitted',
  Drafted = 'drafted',
}

export enum TreeSituation {
  Pending = 'pending',
  Verified = 'verified',
  NotVerified = 'notVerified',
  Update = 'update',
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
