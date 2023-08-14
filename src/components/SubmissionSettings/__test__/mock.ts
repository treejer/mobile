import {initialWeb3State} from 'ranger-redux/modules/web3/web3';
import {initialSettingsState} from 'ranger-redux/modules/settings/settings';
import {initialContractsState} from 'ranger-redux/modules/contracts/contracts';
import configs, {BlockchainNetwork} from 'services/config';
import Web3, {magicGenerator} from 'services/Magic';

export const maticReducers = {
  currentJourney: {},
  web3: {
    ...initialWeb3State,
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzk5NjQ5ODgsInB1YmxpY0FkZHJlc3MiOiIweDk2RjhFRTkwNjE0MjVBMkE3NjYxNUEzMjA0QjdkM0NjYzQ1OUU5QmIiLCJfaWQiOiI2MzVkNGI5NTkzOTM3ZTkxMDAwNzMyNWQifQ.spDY3wDQEsAuI6aEvUMVtBESLET4QN71Y-iPB6HTUA8',
    userId: '635d4b9593937e910007325d',
  },
  settings: initialSettingsState,
  contracts: {
    ...initialContractsState,
    ether: '0',
    dai: '0',
  },
  profile: {
    data: {
      _id: '635d4b9593937e910007325d',
      createdAt: '2022-10-29T15:49:41.349Z',
      email: null,
      emailVerifiedAt: null,
      firstName: 'Armin',
      idCard: '635d6df093937e9100073261',
      isAdmin: false,
      isVerified: true,
      lastLoginAt: '2023-03-28T01:00:18.240Z',
      lastName: 'Bakhshi',
      loginToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzk5NjQ5ODgsInB1YmxpY0FkZHJlc3MiOiIweDk2RjhFRTkwNjE0MjVBMkE3NjYxNUEzMjA0QjdkM0NjYzQ1OUU5QmIiLCJfaWQiOiI2MzVkNGI5NTkzOTM3ZTkxMDAwNzMyNWQifQ.spDY3wDQEsAuI6aEvUMVtBESLET4QN71Y-iPB6HTUA8',
      mobile: '+989194471176',
      mobileCodeRequestedAt: '2022-10-29T18:14:11.704Z',
      mobileCodeRequestsCountForToday: 1,
      mobileCountry: 'IR',
      mobileVerifiedAt: '2022-10-29T18:15:05.602Z',
      passwordResetTokenGeneratedAt: null,
      publicAddress: '0x96F8EE9061425A2A76615A3204B7d3Ccc459E9Bb',
      signedAt: '2023-03-28T00:56:28.293Z',
      updatedAt: '2023-03-28T00:56:26.843Z',
    },
    loading: false,
    loaded: true,
    error: null,
    form: null,
  },
};

const goerliConfig = configs[BlockchainNetwork.Goerli];
const goerliMagic = magicGenerator(configs[BlockchainNetwork.Goerli]);
const georliWeb3 = new Web3(magicGenerator(configs[BlockchainNetwork.Goerli]).rpcProvider as any);

export const goerliReducers = {
  currentJourney: {},
  web3: {
    ...initialWeb3State,
    config: goerliConfig,
    web3: georliWeb3,
    matic: goerliMagic,
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzk5NjQ5ODgsInB1YmxpY0FkZHJlc3MiOiIweDk2RjhFRTkwNjE0MjVBMkE3NjYxNUEzMjA0QjdkM0NjYzQ1OUU5QmIiLCJfaWQiOiI2MzVkNGI5NTkzOTM3ZTkxMDAwNzMyNWQifQ.spDY3wDQEsAuI6aEvUMVtBESLET4QN71Y-iPB6HTUA8',
    userId: '635d4b9593937e910007325d',
  },
  settings: initialSettingsState,
  contracts: {
    ...initialContractsState,
    ether: '0',
    dai: '0',
  },
  profile: {
    data: {
      id: '635d4b9593937e910007325d',
      createdAt: '2022-10-29T15:49:41.349Z',
      email: null,
      emailVerifiedAt: null,
      firstName: 'Armin',
      idCard: '635d6df093937e9100073261',
      isAdmin: false,
      isVerified: true,
      lastLoginAt: '2023-03-28T01:00:18.240Z',
      lastName: 'Bakhshi',
      loginToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzk5NjQ5ODgsInB1YmxpY0FkZHJlc3MiOiIweDk2RjhFRTkwNjE0MjVBMkE3NjYxNUEzMjA0QjdkM0NjYzQ1OUU5QmIiLCJfaWQiOiI2MzVkNGI5NTkzOTM3ZTkxMDAwNzMyNWQifQ.spDY3wDQEsAuI6aEvUMVtBESLET4QN71Y-iPB6HTUA8',
      mobile: '+989194471176',
      mobileCodeRequestedAt: '2022-10-29T18:14:11.704Z',
      mobileCodeRequestsCountForToday: 1,
      mobileCountry: 'IR',
      mobileVerifiedAt: '2022-10-29T18:15:05.602Z',
      passwordResetTokenGeneratedAt: null,
      publicAddress: '0x96F8EE9061425A2A76615A3204B7d3Ccc459E9Bb',
      signedAt: '2023-03-28T00:56:28.293Z',
      updatedAt: '2023-03-28T00:56:26.843Z',
    },
    loading: false,
    loaded: true,
    error: null,
    form: null,
  },
};
