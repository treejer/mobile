import React, {useMemo} from 'react';
import {ApolloClient, InMemoryCache, ApolloLink} from 'apollo-boost';
import {ApolloProvider as OriginalApolloProvider} from '@apollo/react-hooks';
import {RestLink} from 'apollo-link-rest';
import {AbiMapping, EthereumLink} from 'apollo-link-ethereum';
import {Web3JSResolver} from 'apollo-link-ethereum-resolver-web3js/lib';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import Web3 from 'web3';

import config from './config';
import {useAccessToken, useWeb3} from './web3';

function createApolloClient(accessToken?: string, web3?: Web3) {
  const restLink = new RestLink({
    uri: config.treejerApiUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    fieldNameNormalizer: camelCase,
    fieldNameDenormalizer: snakeCase,
  });
  const abiMapping = new AbiMapping();
  Object.entries(config.contracts).map(([name, config]) => {
    abiMapping.addAbi(name, config.abi);
    abiMapping.addAddress(name, 4, config.address);
  });

  const resolver = new Web3JSResolver(abiMapping, web3);
  const originalCall = resolver.resolve;
  const newCall = async (...args: any[]) => {
    const result = await originalCall.apply(resolver, args);
    if (typeof result === 'object' && result != null) {
      return Object.entries(result).reduce(
        (object, [key, value]) => ({
          ...object,
          ...(isNaN(key as any) ? {[key]: value} : {}),
        }),
        {},
      );
    }

    return result;
  };
  resolver.resolve = newCall.bind(resolver);
  const ethereumLink = new EthereumLink(resolver);

  return new ApolloClient({
    link: ApolloLink.from([ethereumLink, restLink]),
    cache: new InMemoryCache(),
  });
}

interface Props {
  children: React.ReactNode;
}

function ApolloProvider({children}: Props) {
  const accessToken = useAccessToken();
  const web3 = useWeb3();

  const client = useMemo(() => createApolloClient(accessToken, web3), [accessToken, web3]);

  return <OriginalApolloProvider client={client}>{children}</OriginalApolloProvider>;
}

export default ApolloProvider;
