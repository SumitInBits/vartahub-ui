import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { ThemeService } from '../../../services/theme/theme-service';
import { NavBarItem } from './navbar-model';
import { ProfileMenu } from '../../profile-menu/profile-menu';
import { AuthContext } from '../../../services/auth/auth-context';

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

  protected readonly authContext = inject(AuthContext);
  protected readonly themeService = inject(ThemeService);

  async register(): Promise<void> {
    await this.authContext.signup();
  }
}
