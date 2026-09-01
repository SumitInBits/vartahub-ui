import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/layout/navbar/navbar';
import { FooterComponent } from './components/layout/footer/footer';

@Component({
  imports: [RouterOutlet, Navbar, FooterComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('vartahub-ui');
}
