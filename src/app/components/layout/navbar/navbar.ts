import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';

@Component({
  imports: [
    MatIcon,
    RouterLinkActive,
    RouterLink,
    MatButton,
    MatIconButton,
    MatToolbar,
    MatSidenavContent,
    MatListItemIcon,
    MatListItemTitle,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
  ],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}
