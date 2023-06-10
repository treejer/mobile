import {PaginationRes} from 'webServices/pagination/pagination';
import {TTreeDetailRes} from 'webServices/trees/treeDetail';

export type TSubmittedTreesRes = PaginationRes<TTreeDetailRes>;
