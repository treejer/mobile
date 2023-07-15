export const mockConfig = {
  contracts: {
    Dai: {
      abi: [],
      address: 'ADDRESS',
    },
    TreeFactory: {
      abi: [],
      address: 'ADDRESS',
    },
    Planter: {
      abi: [],
      address: 'ADDRESS',
    },
    PlanterFund: {
      abi: [],
      address: 'ADDRESS',
    },
  },
};
export const mockWeb3 = {
  utils: {
    toWei: (amount: string, unit?: string) => 'IN ETHER',
  },
  eth: {
    sign: async (message: string, wallet: string) => {
      return 'signature';
    },
    getAccounts: async callback => {
      return callback('', ['WALLET']);
    },
    getBalance: async (wallet: string) => '11',
    Contract: (abi: string, address: string) => {
      return {
        methods: {
          transfer: (to: string, amount: string) => ({
            estimateGas: async ({from}: {from: string}) => 2131,
            send: async (
              {from, gas, gasPrice}: {from: string; gas: string; gasPrice: string},
              callback: (err, res) => void,
            ) => {
              callback('', 'response is here');
            },
          }),
          balanceOf: (wallet: string) => ({
            call: async () => {
              return '22';
            },
          }),
        },
      };
    },
    getGasPrice: async () => 2213123,
  },
};

export const mockWeb3Error = {
  eth: {
    sign: async (message: string, wallet: string) => {
      return 'signature';
    },
    getAccounts: async callback => {
      return callback('error is here!', '');
    },
    Contract: (abi: string, address: string) => {
      return {
        methods: {
          transfer: (to: string, amount: string) => ({
            estimateGas: async ({from}: {from: string}) => 2131,
            send: async (
              {from, gas, gasPrice}: {from: string; gas: string; gasPrice: string},
              callback: (err, res) => void,
            ) => {
              callback('error is here', '');
            },
          }),
          balanceOf: (wallet: string) => ({
            call: async () => {
              return 22;
            },
          }),
        },
      };
    },
    getGasPrice: async () => 2213123,
  },
};

export const mockWeb3AccountsError = {
  ...mockWeb3Error,
  eth: {
    ...mockWeb3Error.eth,
    getAccounts: async callback => {
      return callback('', undefined);
    },
  },
};
