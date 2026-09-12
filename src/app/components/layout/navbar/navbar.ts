import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Keycloak from 'keycloak-js';
import { Footer } from '../footer/footer';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    MatToolbar,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatNavList,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    Footer,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly keycloak = inject(Keycloak);
  protected readonly themeService = inject(ThemeService);

  async register(): Promise<void> {
    await this.keycloak.register({
      redirectUri: window.location.origin + '/',
    });
  }

  async logout(): Promise<void> {
    await this.keycloak.logout({
      redirectUri: window.location.origin + '/',
    });
  }
}
