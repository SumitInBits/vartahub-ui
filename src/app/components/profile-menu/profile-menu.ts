import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthContext } from '../../services/auth/auth-context';

@Component({
  imports: [MatIcon, MatIconButton, MatMenu, MatMenuItem, RouterLink, MatMenuTrigger],
  selector: 'app-profile-menu',
  styleUrl: './profile-menu.css',
  templateUrl: './profile-menu.html',
})
export class ProfileMenu {
  protected readonly authContext = inject(AuthContext);

  async logout(): Promise<void> {
    await this.authContext.logout();
  }
}
