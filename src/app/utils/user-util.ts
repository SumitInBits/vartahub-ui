import { User } from '../models/user-model';

export function getFullName(user: User | undefined): string | undefined {
  return user ? `${user.firstName} ${user.lastName}` : undefined;
}
