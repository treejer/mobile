import {TreeJourney_V2} from 'screens/TreeSubmissionV2/types';

export function canUpdateJourneyLocation(tree?: TreeJourney_V2['tree'], isNursery?: boolean) {
  return tree?.treeSpecsEntity?.locations?.length === 0 && isNursery;
}
