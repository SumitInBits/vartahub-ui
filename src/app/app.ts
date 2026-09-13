import { Component, signal } from '@angular/core';
import { Navbar } from './components/layout/navbar/navbar';
import { OnboardingForm } from './components/onboarding-form/onboarding-form';

@Component({
  imports: [Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('vartahub-ui');
}
