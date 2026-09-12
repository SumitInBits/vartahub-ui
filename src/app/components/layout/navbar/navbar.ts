import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Keycloak from 'keycloak-js';
import { Footer } from '../footer/footer';
import { ThemeService } from '../../../services/theme-service';
import { NavBarItem } from './navbar-model';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ProfileMenu } from '../../profile-menu/profile-menu';

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
    ProfileMenu,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly navBarItems: NavBarItem[] = [
    { title: 'Home', route: '/', authentication: false, icon: 'home', routeExact: true },
    {
      title: 'Instructor',
      route: '/instructor',
      authentication: false,
      icon: 'school',
      routeExact: false,
    },
    {
      title: 'Meetings',
      route: '/meeting',
      authentication: false,
      icon: 'groups',
      routeExact: false,
    },
  ];

  protected readonly keycloak = inject(Keycloak);
  protected readonly themeService = inject(ThemeService);

  async register(): Promise<void> {
    await this.keycloak.register({
      redirectUri: window.location.origin + '/',
    });
  }
}
