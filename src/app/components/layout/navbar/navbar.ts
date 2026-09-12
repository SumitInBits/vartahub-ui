import { ChangeDetectionStrategy, Component, effect, inject, Renderer2, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Keycloak from 'keycloak-js';
import { Footer } from '../footer/footer';
import { ThemeMode } from '../../../types/global.type';

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
  private readonly theme = signal<ThemeMode>('system');
  private readonly _renderer = inject(Renderer2);

  constructor() {
    effect(() => this._setTheme(this.theme()));
  }

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

  protected toggleDarkMode() {
    console.log(this.isDarkMode())
    if(this.isDarkMode()) {
      this.theme.set('light');
    }
    else {
      this.theme.set('dark');
    }
  }

  private _setTheme(theme: ThemeMode) {
    this._renderer.setProperty(
      document.body.style,
      'color-scheme',
      theme === 'system' ? 'light dark' : theme,
    );
  }

  protected isDarkMode(): boolean {
    return this.theme() === 'dark';
  }
}
