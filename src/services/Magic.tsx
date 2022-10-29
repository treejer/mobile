import {Magic, MagicUserMetadata} from '@magic-sdk/react-native';
import Web3 from 'web3';
import {BlockchainNetwork, NetworkConfig} from 'services/config';
import {OAuthExtension} from '@magic-ext/react-native-oauth';

export interface OAuthRedirectResult {
  oauth: {
    provider: string;
    scope: string[];
    accessToken: string;
    userHandle: string;

    // `userInfo` contains the OpenID Connect profile information
    // about the user. The schema of this object should match the
    // OpenID spec, except that fields are `camelCased` instead
    // of `snake_cased`.
    // The presence of some fields may differ depending on the
    // specific OAuth provider and the user's own privacy settings.
    // See: https://openid.net/specs/openid-connect-basic-1_0.html#StandardClaims

    userInfo: any;
  };

  magic: {
    idToken: string;
    userMetadata: MagicUserMetadata;
  };
}

export function isMatic(config: NetworkConfig) {
  return config.magicNetwork !== BlockchainNetwork.Goerli;
}

export function magicGenerator(config: NetworkConfig) {
  return new Magic(config.magicApiKey, {
    network: {
      rpcUrl: config.web3Url,
      chainId: Number(config.chainId),
    },
    extensions: [new OAuthExtension()],
  });
}

export {Magic};

export default Web3;
