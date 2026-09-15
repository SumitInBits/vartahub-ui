import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthContext } from '../services/auth/auth-context';
import { Role } from '../models/global-model';

export const adminGuard: CanActivateFn = (route, state) => {
  const authContext = inject(AuthContext);
  const router = inject(Router);

  if (authContext.authenticated() && authContext.hasRole(Role.ADMIN)) {
    return true;
  }
  return router.parseUrl('/forbidden');
};
