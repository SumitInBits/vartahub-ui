import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { AuthContext } from '../services/auth/auth-context';

const isAccessAllowed = async (_: ActivatedRouteSnapshot, __: RouterStateSnapshot, authData: AuthGuardData,): Promise<boolean | UrlTree> => {
  const { authenticated } = authData;
  if (authenticated) {
    return true;
  }
  const authContext = inject(AuthContext);
  await authContext.login();
  return false;
};

export const authGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
