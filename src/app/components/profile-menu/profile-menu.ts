import { Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthContext } from '../../services/auth/auth-context';
import { IamService } from '../../services/api/iam-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { getFullName } from '../../utils/user-util';
import { StorageService } from '../../services/storage/storage-service';

@Component({
  imports: [MatIcon, MatIconButton, MatMenu, MatMenuItem, RouterLink, MatMenuTrigger],
  selector: 'app-profile-menu',
  styleUrl: './profile-menu.css',
  templateUrl: './profile-menu.html',
})
export class ProfileMenu {
  protected readonly authContext = inject(AuthContext);
  protected readonly iamService = inject(IamService);
  protected readonly user = toSignal(this.iamService.getUser());

  protected getFullName = computed(() => getFullName(this.user()));

  async logout(): Promise<void> {
    await this.authContext.logout();
  }
}
