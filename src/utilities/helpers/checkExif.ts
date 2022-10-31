export function checkExif(isMainNet: boolean, checkMetaData: boolean) {
  console.log({isMainNet, checkMetaData, result: isMainNet || checkMetaData});
  return isMainNet || checkMetaData;
}
