import { Component, signal } from '@angular/core';
import { OnboardingForm } from './components/onboarding-form/onboarding-form';

@Component({
  imports: [OnboardingForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('vartahub-ui');
}
