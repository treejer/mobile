import { DocumentNode } from "graphql-typed";
export namespace SettingsQueryPartialData {
  export interface SettingsForceUpdate {
    __typename?: "ForceUpdateSetting" | null;
    version?: string | null;
    force?: boolean | null;
  }
  export interface Settings {
    __typename?: "Settings" | null;
    id?: string | null;
    forceUpdate?: SettingsQueryPartialData.SettingsForceUpdate | null;
  }
}
export interface SettingsQueryPartialData {
  settings?: (SettingsQueryPartialData.Settings | null)[] | null;
}
export namespace SettingsQueryData {
  export interface SettingsForceUpdate {
    __typename: "ForceUpdateSetting";
    version?: string | null;
    force?: boolean | null;
  }
  export interface Settings {
    __typename: "Settings";
    id?: string | null;
    forceUpdate?: SettingsQueryData.SettingsForceUpdate | null;
  }
}
export interface SettingsQueryData {
  settings?: (SettingsQueryData.Settings | null)[] | null;
}
declare const document: DocumentNode<SettingsQueryData, never, SettingsQueryPartialData>;
export default document;