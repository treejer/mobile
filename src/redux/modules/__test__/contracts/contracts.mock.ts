export const mockConfig = {
  contracts: {
    Dai: {
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
