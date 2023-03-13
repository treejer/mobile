import {DefaultNamespace, KeyPrefix, Namespace, TFuncKey, TFunction, UseTranslationOptions} from 'react-i18next';
import {i18n, StringMap, TFunctionResult, TOptions} from 'i18next';

export declare module 'react-i18next' {
  export interface TFunction<N extends Namespace = DefaultNamespace, TKPrefix = undefined> {
    <
      TKeys extends TFuncKey<N, TKPrefix> | TemplateStringsArray extends infer A ? A : never,
      TDefaultResult extends TFunctionResult = string,
      TInterpolationMap extends object = StringMap,
    >(
      key: TKeys | TKeys[],
      options?: TOptions<TInterpolationMap> | string,
    ): string;
    <
      TKeys extends TFuncKey<N, TKPrefix> | TemplateStringsArray extends infer A ? A : never,
      TDefaultResult extends TFunctionResult = string,
      TInterpolationMap extends object = StringMap,
    >(
      key: TKeys | TKeys[],
      defaultValue?: string,
      options?: TOptions<TInterpolationMap> | string,
    ): string;
  }

  export function useTranslation<N extends Namespace = DefaultNamespace, TKPrefix extends KeyPrefix<N> = undefined>(
    ns?: N | Readonly<N>,
    options?: UseTranslationOptions<TKPrefix>,
  ): [TFunction<N, TKPrefix>, i18n, boolean] & {
    t: TFunction<N, TKPrefix>;
    i18n: i18n;
    ready: boolean;
  };
}
