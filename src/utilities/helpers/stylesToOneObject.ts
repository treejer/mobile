export function stylesToOneObject(styles) {
  return styles.reduce((acc, item) => {
    return {
      ...acc,
      ...(Array.isArray(item) ? stylesToOneObject(item) : item),
    };
  }, {});
}
