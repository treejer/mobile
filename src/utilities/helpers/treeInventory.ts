export enum TreeLife {
  Submitted = 'submitted',
  Drafted = 'drafted',
}

export enum TreeStatus {
  Pending = 'pending',
  Verified = 'verified',
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

export function treeInventoryTreeStatues() {}
