export function stylesToOneObject(styles) {
  return Array.isArray(styles)
    ? styles.reduce((acc, item) => {
        return {
          ...acc,
          ...(Array.isArray(item) ? stylesToOneObject(item) : item),
        };
      }, {})
    : styles;
}
