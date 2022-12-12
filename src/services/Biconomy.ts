import {Biconomy} from '@biconomy/mexa';
import {Magic} from 'services/Magic';

export type TransactionBiconomyOptions = {
  apiKey: string;
  magic: Magic;
};

export function transactionBiconomy(options: TransactionBiconomyOptions) {
  return new Promise<typeof Biconomy>((resolve, reject) => {
    const {apiKey, magic} = options;
    console.log(apiKey, '<== apikey is hererererererer');

    const _config = {
      apiKey,
      debug: true,
      strictMode: true,
      // auditorsCount: config.isMainnet ? 1 : 0,
      // methodSuffix: '_v4',
      // jsonStringifyRequest: true,

      // performDryRunViewRelayCall: false,
      // preferredRelays: [config.preferredRelays],
      // relayLookupWindowBlocks: Number(config.relayLookupWindowBlocks),
      // relayRegistrationLookupBlocks: Number(config.relayRegistrationLookupBlocks),
      // pastEventsQueryMaxPageSize: Number(config.pastEventsQueryMaxPageSize),

      // preferredRelays: ['https://rinkeby-gsn-relayer.treejer.com'],
      // preferredRelays: ['https://ropsten-gsn-relayer.treejer.com/gsn1/getaddr'],
    };

    const biconomy = new Biconomy(magic.rpcProvider as any, _config);

    biconomy
      .onEvent(biconomy.READY, () => {
        resolve(biconomy);
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        reject(message);
      });
  });
}
