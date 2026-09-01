import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/layout/navbar/navbar';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule
import { FooterComponent } from './components/layout/footer/footer';
import { filter } from 'rxjs';

@Component({
  imports: [RouterOutlet, Navbar, FooterComponent, CommonModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('vartahub-ui');
  private router = inject(Router);
  currentUrl = '';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .forEach((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  isConferenceRoute(): boolean {
    return this.currentUrl.includes('/conference');
  }
}
