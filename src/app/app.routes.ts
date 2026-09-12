import { Routes } from '@angular/router';
import { SignupPage } from './pages/signup-page/signup-page';
import { authGuard } from './guards/auth-guard';
import { HomePage } from './pages/home-page/home-page';
import { ScheduleMeetingPage} from './pages/schedule-meeting-page/schedule-meeting-page';
import { InstructorPage } from './pages/instructor-page/instructor-page';
import{ MeetingPage } from './pages/meeting-page/meeting-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { AdminDashboard} from './pages/admin-page/admin-dashboard/admin-dashboard';


export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'signup', component: SignupPage, canActivate: [authGuard] },
  { path: 'schedule-meeting', component: ScheduleMeetingPage },
  { path: 'instructor', component: InstructorPage, },
  { path: 'meeting', component: MeetingPage },
  { path: 'profile', component: ProfilePage },
  { path: 'admin', component: AdminDashboard},
];
