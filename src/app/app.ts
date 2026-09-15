import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';

import { Navbar } from './components/layout/navbar/navbar';
import { MatDialog } from '@angular/material/dialog';
import { AuthContext } from './services/auth/auth-context';
import { IamService } from './services/api/iam-service';
import { OnboardingStatus } from './models/global-model';
import { OnboardingForm } from './components/onboarding-form/onboarding-form';
import { StorageService } from './services/storage/storage-service';

@Component({
  imports: [Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('VartaHub');
  private readonly onboardingStatusKey = 'onboardingStatus';
  private dialog = inject(MatDialog);
  private readonly authContext = inject(AuthContext);
  private readonly iamService = inject(IamService);
  private readonly storageService = inject(StorageService);

  ngOnInit(): void {
    if(this.storageService.get<OnboardingStatus>(this.onboardingStatusKey) === undefined) {
      if (this.authContext.authenticated()) {
        this.iamService.getOnboardingStatus().subscribe((status) => {
          if (status === OnboardingStatus.PENDING) {
            this.dialog.open(OnboardingForm, {
              width: '100vw',
              maxWidth: '100vw',
              height: '100vh',
              maxHeight: '100vh',
            });
          } else {
            this.storageService.set(this.onboardingStatusKey, status);
          }
        });
      }
    }
  }
}
