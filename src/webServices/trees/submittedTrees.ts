import {PaginationRes} from 'webServices/pagination/pagination';
import {TTreeDetailRes} from 'webServices/trees/treeDetail';
import {SubmittedTreeStatus} from 'utilities/helpers/treeInventory';

export type SubmittedTree = TTreeDetailRes & {
  status?: SubmittedTreeStatus;
};

export type TSubmittedTreesRes = PaginationRes<SubmittedTree>;
