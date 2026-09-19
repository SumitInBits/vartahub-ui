import { inject, Service } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Role } from '../../models/global-model';

@Service()
export class AuthContext {
  private readonly keycloak = inject(Keycloak);

  authenticated() {
    return this.keycloak.authenticated;
  }

  getId() {
    return this.keycloak.subject;
  }

  getRole(): Role | undefined {
    const roles = this.keycloak.realmAccess?.roles ?? [];
    const priority = [Role.ADMIN, Role.INSTRUCTOR, Role.USER];
    return priority.find((role) => roles.includes(role.toLowerCase()));
  }

  hasAnyRoles(roles: Role[]): boolean {
    return roles.some((role) => this.keycloak.hasRealmRole(role.toLowerCase()));
  }

  hasRole(role: Role) {
    return this.keycloak.hasRealmRole(role.toLowerCase());
  }

  async login(): Promise<void> {
    await this.keycloak.login({
      redirectUri: window.location.origin + window.location.pathname,
    });
  }

  async signup(): Promise<void> {
    await this.keycloak.register({
      redirectUri: window.location.origin + '/',
    });
  }

  async logout(): Promise<void> {
    await this.keycloak.logout();
  }
}
