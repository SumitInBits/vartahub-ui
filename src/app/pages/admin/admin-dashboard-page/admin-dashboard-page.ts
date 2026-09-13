import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminModuleCard } from '../admin-model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css',
})
export class AdminDashboardPage {
  adminModules: AdminModuleCard[] = [
    {
      title: 'Manage Specialisations',
      description: 'Add, edit, or remove professional specialisations and categories.',
      icon: 'medical_services',
      route: '/admin/manage-specialisations',
    },
    {
      title: 'Manage Users',
      description: 'View user accounts, manage permissions, roles, and status.',
      icon: 'group_manage',
      route: 'manage-users',
    },
    {
      title: 'System Settings',
      description: 'Configure global system parameters, integrations, and preferences.',
      icon: 'tune',
      route: 'settings',
    },
    {
      title: 'Audit Logs',
      description: 'Monitor application activity, error reports, and security events.',
      icon: 'history',
      route: 'logs',
    },
  ];
}
