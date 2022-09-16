export function web3Error({message}: any) {
  let startPoint = message.indexOf('(');
  let endPoint = message.indexOf(')');
  const searchRegExp = /"/g;

  const errorArray = message
    .slice(startPoint + 1, endPoint)
    .split(',')
    .map((err: string) => err.replace(searchRegExp, '').replace(' ', '').split('='));

  return Object.fromEntries(errorArray);
}
