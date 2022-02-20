import React, {useMemo} from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  ApolloProvider as OriginalApolloProvider,
} from '@apollo/client';
import {RestLink} from 'apollo-link-rest';
import {onError} from '@apollo/client/link/error';
import {AbiMapping, EthereumLink} from 'apollo-link-ethereum';
import {Web3JSResolver} from 'apollo-link-ethereum-resolver-web3js/lib';
import camelCase from 'lodash/camelCase';
import Web3 from 'web3';

import config from './config';
import {useAccessToken, useUserId, useWeb3} from './web3';

function createRestLink(accessToken?: string, userId?: string) {
  const errorLink = onError(({graphQLErrors, response, networkError}) => {
    console.log(`[Network error]:`, networkError ? JSON.parse(JSON.stringify(networkError)) : response);
    // console.log(`[graphQLErrors error]:`, graphQLErrors);
    if (graphQLErrors) {
      response.errors = null;
    }
  });

  return errorLink.concat(
    new RestLink({
      uri: config.treejerApiUrl,
      headers: {
        'x-auth-userid': userId,
        'x-auth-logintoken': accessToken,
        Accept: 'application/json',
      },
      bodySerializers: {
        formData: (data: {[key: string]: any}, headers: Headers) => {
          const formData = new FormData();
          let hasFile = false;
          let canSetHeader = true;
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
              }
              if (data.idCardFile.lastModified) {
                canSetHeader = false;
                formData.append(key, value);
              } else {
                formData.append(key, value);
              }
            }
          }
          if (canSetHeader) {
            headers.set('Content-Type', hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded');
          }

          return {body: formData, headers};
        },
      },
      fieldNameNormalizer: camelCase,
      // responseTransformer: async (data, typeName) => {
      //   console.log(await data.json(), '====> await data.json() <====');
      //   return {...data, message: data};
      // }
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

function createApolloClient(accessToken?: string, userId?: string, web3?: Web3) {
  const restLink = createRestLink(accessToken, userId);
  const ethereumLink = createEthereumLink(web3);

  const uri = config.thegraphUrl;
  const graphqlLink = new HttpLink({uri});

  return new ApolloClient({
    link: ApolloLink.from([restLink, ethereumLink, graphqlLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            tempTrees: {
              keyArgs: false,
              merge(existing = [], incoming) {
                return [...(existing || []), ...(incoming || [])];
              },
            },
            trees: {
              keyArgs: false,
              merge(existing = [], incoming) {
                return [...(existing || []), ...(incoming || [])];
              },
            },
          },
        },
      },
    }),
  });
}

interface Props {
  children: React.ReactNode;
}

function ApolloProvider({children}: Props) {
  const accessToken = useAccessToken();
  console.log(accessToken, 'accessToken');
  const userId = useUserId();
  console.log(userId, 'userId');
  const web3 = useWeb3();

  const client = useMemo(() => createApolloClient(accessToken, userId, web3), [accessToken, web3, userId]);

  return <OriginalApolloProvider client={client}>{children}</OriginalApolloProvider>;
}

export default ApolloProvider;
