export type RestApiError = {
  statusCode: number;
  name: string;
  message: string;
};

export function restApiError(error: any): RestApiError {
  return error?.networkError?.result?.error;
}
