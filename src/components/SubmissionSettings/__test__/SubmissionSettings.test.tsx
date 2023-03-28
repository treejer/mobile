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
      let getElementByTestId;
      beforeEach(() => {
        const element = render(<SubmissionSettings />, maticReducers);
        getElementByTestId = element.getByTestId;
      });

      it('elements should be defined', () => {
        const biconomy = getElementByTestId('use-biconomy');
        const biconomyDetail = getElementByTestId('biconomy-detail');
        const transactionMethodSwitch = getElementByTestId('transaction-switch');
        const balanceLabel = getElementByTestId('network-balance-label');
        const balanceValue = getElementByTestId('network-balance');

        expect(biconomy).toBeTruthy();
        expect(biconomy.props.children).toBe('settings.useBiconomy');
        expect(biconomyDetail).toBeTruthy();
        expect(biconomyDetail.props.children).toBe('settings.gsnDetails');
        expect(transactionMethodSwitch).toBeTruthy();
        expect(balanceLabel).toBeTruthy();
        expect(balanceLabel.props.children).toBe('settings.maticBalance');
        expect(balanceValue).toBeTruthy();
      });
    });
    describe('goerli elements should be defined', () => {
      let getElementByTestId;
      beforeEach(() => {
        const element = render(<SubmissionSettings />, goerliReducers);
        getElementByTestId = element.getByTestId;
      });

      it('elements should be defined', () => {
        const biconomy = getElementByTestId('use-biconomy');
        const biconomyDetail = getElementByTestId('biconomy-detail');
        const transactionMethodSwitch = getElementByTestId('transaction-switch');
        const balanceLabel = getElementByTestId('network-balance-label');
        const balanceValue = getElementByTestId('network-balance');
        const checkMetaDataLabel = getElementByTestId('check-meta-data-label');
        const checkMetaDataSwitch = getElementByTestId('check-meta-data-switch');

        expect(biconomy).toBeTruthy();
        expect(biconomyDetail).toBeTruthy();
        expect(biconomyDetail.props.children).toBe('settings.gsnDetails');
        expect(biconomy.props.children).toBe('settings.useBiconomy');
        expect(transactionMethodSwitch).toBeTruthy();
        expect(balanceLabel).toBeTruthy();
        expect(balanceLabel.props.children).toBe('settings.ethBalance');
        expect(balanceValue).toBeTruthy();
        expect(checkMetaDataLabel).toBeTruthy();
        expect(checkMetaDataSwitch).toBeTruthy();
      });
    });
  });
});
