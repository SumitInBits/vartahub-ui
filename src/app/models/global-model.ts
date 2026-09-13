export type ThemeMode = 'system' | 'light' | 'dark';

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
}

export enum Experience {
  FRESHER = 'FRESHER',
  EXPERIENCED = 'EXPERIENCED',
}

export enum OnboardingStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum Proficiency {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT',
}
