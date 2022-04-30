export function isNumber(value: any): boolean {
  return Number.isInteger(Number(value));
}

export function validateEmail(value: string): boolean {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
}
