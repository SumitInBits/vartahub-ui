import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [MatToolbar, MatIcon, MatIconButton, MatButton, RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected toggleSidebar = false;

  protected handleToggleSidebar(): void {
    this.toggleSidebar = !this.toggleSidebar;
  }
}
