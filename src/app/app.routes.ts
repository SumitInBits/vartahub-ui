import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ScheduleMeetingPage } from './pages/schedule-meeting-page/schedule-meeting-page';
import { InstructorPage } from './pages/instructor-page/instructor-page';
import { MeetingPage } from './pages/meeting-page/meeting-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { AdminDashboardPage } from './pages/admin/admin-dashboard-page/admin-dashboard-page';
import { ManageSpecialisationPage } from './pages/admin/manage-specialisation-page/manage-specialisation-page';
import { ForbiddenPage } from './pages/forbidden-page/forbidden-page';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'schedule-meeting', component: ScheduleMeetingPage },
  { path: 'instructor', component: InstructorPage },
  { path: 'meeting', component: MeetingPage, canActivate: [authGuard] },
  { path: 'profile', component: ProfilePage, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardPage, canActivate: [authGuard, adminGuard] },
  { path: 'admin/manage-specialisations', component: ManageSpecialisationPage, canActivate: [authGuard, adminGuard]},
  { path: 'forbidden', component: ForbiddenPage },
  { path: '**', component: ForbiddenPage}
];
