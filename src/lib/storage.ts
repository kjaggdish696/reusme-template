export function readJSON<T>(_key: string, fallback: T): T {
  return fallback;
}

export function writeJSON<T>(_key: string, _value: T): void {
  // Disabled: All data is stored in the database now.
}

export function removeKey(_key: string): void {
  // Disabled
}
