import { Service } from '@angular/core';

@Service()
export class StorageService {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | undefined {
    const value = localStorage.getItem(key);

    if (value === null) {
      return undefined;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
