const config = {
  contracts: {
    TreeFactory: {
      address: process.env.REACT_NATIVE_CONTRACT_TREEFACTORY_ADDRESS,
      abi: require('../../contracts/TreeFactory.json').abi,
    },
    GBFactory: {
      address: process.env.REACT_NATIVE_CONTRACT_GBFACTORY_ADDRESS,
      abi: require('../../contracts/GBFactory.json').abi,
    },
  },
  storageKeys: {
    privateKey: '__TREEJER_PRIVATE_KEY',
  },
  web3Url: process.env.REACT_NATIVE_WEB3_PROVIDER,
  treejerApiUrl: process.env.REACT_NATIVE_TREEJER_API_URL.replace(/\/$/, ''),
  publicKeyRecoveryMessage: process.env.REACT_NATIVE_PUBLIC_KEY_RECOVERY_MESSAGE,
  treejerClientSecret: process.env.REACT_NATIVE_TREEJER_CLIENT_SECRET,
  treejerClientId: process.env.REACT_NATIVE_TREEJER_CLIENT_ID,
};

export default config;
