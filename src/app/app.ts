import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/layout/navbar/navbar';
import { SignupPage } from './pages/signup-page/signup-page';
import { Footer } from './components/layout/footer/footer';
import { PageLoader } from './components/layout/page-loader/page-loader';

@Component({
  imports: [RouterOutlet, Navbar, Footer, PageLoader],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('vartahub-ui');
}
