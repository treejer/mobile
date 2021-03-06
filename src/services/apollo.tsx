import React, {useMemo} from 'react';
import {ApolloClient, InMemoryCache, ApolloLink} from 'apollo-boost';
import {ApolloProvider as OriginalApolloProvider} from '@apollo/react-hooks';
import {RestLink} from 'apollo-link-rest';
import {onError} from 'apollo-link-error';
import {AbiMapping, EthereumLink} from 'apollo-link-ethereum';
import {Web3JSResolver} from 'apollo-link-ethereum-resolver-web3js/lib';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import Web3 from 'web3';

import config from './config';
import {useAccessToken, useWeb3} from './web3';

function createRestLink(accessToken?: string) {
  const errorLink = onError(({graphQLErrors, response}) => {
    // console.log(`[Network error]:`, networkError);
    // console.log(`[graphQLErrors error]:`, graphQLErrors);
    if (graphQLErrors) {
      response.errors = null;
    }
  });

  return errorLink.concat(
    new RestLink({
      uri: config.treejerApiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      bodySerializers: {
        formData: (data: Record<string, any>, headers: Headers) => {
          const formData = new FormData();
          let hasFile = false;
          for (const key in data) {
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(key)) {
              const value = data[key];

              if (/file:\//.test(value)) {
                hasFile = true;
                formData.append(key, {
                  uri: value,
                  name: 'file.jpg',
                  type: 'image/jpg',
                } as any);
              } else {
                formData.append(key, value);
              }
            }
          }

          headers.set('Content-Type', hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded');

          return {body: formData, headers};
        },
      },
      fieldNameNormalizer: camelCase,
      fieldNameDenormalizer: snakeCase,
    }),
  );
}

function createEthereumLink(web3?: Web3) {
  const abiMapping = new AbiMapping();
  Object.entries(config.contracts).map(([name, contract]) => {
    abiMapping.addAbi(name, contract.abi);
    abiMapping.addAddress(name, config.networkId, contract.address);
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

  return new EthereumLink(resolver);
}

function createApolloClient(accessToken?: string, web3?: Web3) {
  const restLink = createRestLink(accessToken);
  const ethereumLink = createEthereumLink(web3);

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
