export function shortenedString(text: string, length: number, dots: number) {
  const sliceIndex = (length - dots) / 2;
  return text.length >= length
    ? `${text.slice(0, sliceIndex)}${new Array(dots + 1).join('.')}${text.slice(text.length - sliceIndex)}`
    : text;
}

export function wrapUpString(text: string, cutIndex: number, dots: number) {
  return text.length > dots ? `${text.slice(0, cutIndex)}${new Array(dots + 1).join('.')}` : text;
}
