import { Page } from '../models/global-model';

export function createEmptyPage<T>(size: number = 10): Page<T> {
  return {
    content: [],
    page: 0,
    size: size,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  };
}
