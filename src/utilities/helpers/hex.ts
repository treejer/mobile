export function hexEncode(str) {
  let hex, i;

  let result = '';
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
}

export const Hex2Dec = (hex: string) => parseInt(hex, 16);
