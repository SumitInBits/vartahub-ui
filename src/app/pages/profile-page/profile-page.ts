import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { IamService } from '../../services/api/iam-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthContext } from '../../services/auth/auth-context';
import { OnboardingStatus } from '../../models/global-model';
import { getFullName } from '../../utils/user-util';

@Component({
  imports: [MatIcon, MatButton],
  selector: 'app-profile-page',
  styleUrl: './profile-page.css',
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private readonly iamService = inject(IamService);
  protected readonly authContext = inject(AuthContext);
  protected readonly user = toSignal(this.iamService.getUser());

  protected getFullName = computed(() => getFullName(this.user()));

  protected getInitials = computed(() => {
    const user = this.user();
    return user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : undefined;
  });

  protected readonly OnboardingStatus = OnboardingStatus;
}
