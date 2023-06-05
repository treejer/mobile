import {render} from 'ranger-testUtils/testingLibrary';
import {SubmissionSettings} from 'components/SubmissionSettings/SubmissionSettings';
import {goerliReducers, maticReducers} from 'components/SubmissionSettings/__test__/mock';

describe('SubmissionSettings component', () => {
  it('SubmissionSettings component should be defined', () => {
    expect(SubmissionSettings).toBeDefined();
    expect(typeof SubmissionSettings).toBe('function');
  });

  describe('SubmissionSettings', () => {
    describe('matic elements should be defined', () => {
      let getElementByTestId, queryElementByTestId;
      beforeEach(() => {
        const element = render(<SubmissionSettings />, maticReducers);
        getElementByTestId = element.getByTestId;
        queryElementByTestId = element.queryByTestId;
      });

      it('elements should be defined', () => {
        const biconomy = queryElementByTestId('use-biconomy');
        const biconomyDetail = queryElementByTestId('biconomy-detail');
        const transactionMethodSwitch = queryElementByTestId('transaction-switch');
        const balanceLabel = queryElementByTestId('network-balance-label');
        const balanceValue = queryElementByTestId('network-balance');

        expect(biconomy).toBeFalsy();
        // expect(biconomy.props.children).toBe('settings.useBiconomy');
        expect(biconomyDetail).toBeFalsy();
        // expect(biconomyDetail.props.children).toBe('settings.gsnDetails');
        expect(transactionMethodSwitch).toBeFalsy();
        expect(balanceLabel).toBeFalsy();
        // expect(balanceLabel.props.children).toBe('settings.maticBalance');
        expect(balanceValue).toBeFalsy();
      });
    });
    describe('goerli elements should be defined', () => {
      let getElementByTestId, queryElementByTestId;
      beforeEach(() => {
        const element = render(<SubmissionSettings />, goerliReducers);
        getElementByTestId = element.getByTestId;
        queryElementByTestId = element.queryByTestId;
      });

      it('elements should be defined', () => {
        const biconomy = queryElementByTestId('use-biconomy');
        const biconomyDetail = queryElementByTestId('biconomy-detail');
        const transactionMethodSwitch = queryElementByTestId('transaction-switch');
        const balanceLabel = queryElementByTestId('network-balance-label');
        const balanceValue = queryElementByTestId('network-balance');
        const checkMetaDataLabel = getElementByTestId('check-meta-data-label');
        const checkMetaDataSwitch = getElementByTestId('check-meta-data-switch');

        expect(biconomy).toBeFalsy();
        expect(biconomyDetail).toBeFalsy();
        // expect(biconomyDetail.props.children).toBe('settings.gsnDetails');
        // expect(biconomy.props.children).toBe('settings.useBiconomy');
        expect(transactionMethodSwitch).toBeFalsy();
        expect(balanceLabel).toBeFalsy();
        // expect(balanceLabel.props.children).toBe('settings.ethBalance');
        expect(balanceValue).toBeFalsy();
        expect(checkMetaDataLabel).toBeTruthy();
        expect(checkMetaDataSwitch).toBeTruthy();
      });
    });
  });
});
