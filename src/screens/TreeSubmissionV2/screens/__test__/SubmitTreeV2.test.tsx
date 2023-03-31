import {SubmitTreeV2} from 'screens/TreeSubmissionV2/screens/SubmitTreeV2/SubmitTreeV2';
import {render} from 'ranger-testUtils/testingLibrary';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {Routes} from 'navigation/Navigation';
import {mockPlantTreePermissionsGranted} from 'screens/TreeSubmissionV2/components/__test__/mock';

describe('SubmitTreeV2 component', () => {
  it('SubmitTreeV2 component should be defined', () => {
    expect(SubmitTreeV2).toBeDefined();
    expect(typeof SubmitTreeV2).toBe('function');
  });
  describe(test, () => {
    const element = render(
      <TestSubmissionStack
        name={Routes.SubmitTree_V2}
        component={<SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsGranted} />}
      />,
      goerliReducers,
    );
  });
});
